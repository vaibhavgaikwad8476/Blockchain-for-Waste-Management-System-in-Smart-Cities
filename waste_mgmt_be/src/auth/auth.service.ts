import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginUserDto, SignupUserDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserRepository } from '../user/user.repository';
import { UserEntity } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginUserDto) {
    try {
      // Generate the password hash
      const user = await this.userRepo.getUserByEmail(dto.email);

      if (!user) throw new ForbiddenException('Incorrect Credentials');

      const isPasswordMatch = await argon.verify(user.password, dto.password);

      if (!isPasswordMatch)
        throw new ForbiddenException('Incorrect Credentials');
      delete user.password;
      const token = await this.signToken(user.id, user.email);
      return {
        ...token,
        userDetails: { ...user },
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('Credentials already exist');
      }
      throw error;
    }
  }

  async signup(dto: SignupUserDto) {
    try {
      const passwordHash = await argon.hash(dto.password);
      const user = new UserEntity(
        dto.email,
        dto.name,
        passwordHash,
        dto.address,
        dto.phoneNumber,
        dto.location,
        dto.type,
      );
      const createResponse = await this.userRepo.createUser(user);
      delete createResponse.password;
      return createResponse;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('Credentials already exist');
      }
      throw error;
    }
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email: email };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
