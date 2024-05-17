import { UserEntity } from './../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(user: UserEntity): Promise<UserEntity> {
    return this.prisma.user.create({ data: user });
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserById(id: string): Promise<UserEntity> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getAllUsers(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      where: {
        role: {
          not: 'ADMIN',
        },
      },
      include: {
        // Include necessary fields from the user model if needed
        wasteCollections: {
          include: {
            wasteType: true,
          },
          orderBy: {
            collectionDate: 'desc', // Order by collectionDate in descending order to get the latest request first
          },
          where: {
            status: 'PENDING',
          },
        },
        // Include other relations if necessary
      },
    });

    return users;
  }
}
