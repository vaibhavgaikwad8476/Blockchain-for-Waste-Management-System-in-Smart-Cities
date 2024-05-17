import { Injectable } from '@nestjs/common';
import { WasteType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WasteTypeRepository {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<WasteType[]> {
    return this.prisma.wasteType.findMany({});
  }
}
