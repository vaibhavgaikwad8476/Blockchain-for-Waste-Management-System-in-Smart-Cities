import { WasteCollectionEntity } from './../entities/waste-collection.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWasteCollectionDto, UpdateWasteCollectionDto } from './dto';
import { CollectionStatus } from '@prisma/client';

interface IGetWasteCollection {
  id: string;
}

interface IUpdateWasteCollection {
  id: string;
}

export interface IGetAllWasteCollection {
  status?: CollectionStatus;
  page: number;
  limit: number;
  userId?: string;
}

@Injectable()
export class WasteCollectionRepository {
  constructor(private prisma: PrismaService) {}

  async getAll(queryParams: IGetAllWasteCollection): Promise<{
    page: number;
    count: number;
    limit: number;
    data: WasteCollectionEntity[];
  }> {
    const skip = (queryParams.page - 1) * queryParams.limit; // Calculate the offset
    const take = queryParams.limit;

    const { page, limit, ...dbQueryParams } = queryParams;

    const allWasteCollection = await this.prisma.wasteCollection.findMany({
      skip,
      take,
      where: dbQueryParams,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            locationCoordinates: true,
            address: true,
          },
        },
        wasteType: true,
      },
      orderBy: {
        collectionDate: 'desc',
      },
    });

    const count = await this.prisma.wasteCollection.count({
      where: dbQueryParams,
    });

    return {
      page,
      count,
      limit,
      data: allWasteCollection,
    };
  }

  async createWasteCollection(
    wasteCollection: CreateWasteCollectionDto,
  ): Promise<WasteCollectionEntity> {
    return this.prisma.wasteCollection.create({
      data: wasteCollection,
    });
  }

  async getWasteCollection(
    whereVales: IGetWasteCollection,
  ): Promise<WasteCollectionEntity> {
    return this.prisma.wasteCollection.findUnique({
      where: whereVales,
    });
  }

  async updateWasteCollection(
    whereVales: IUpdateWasteCollection,
    updateValues: UpdateWasteCollectionDto,
  ): Promise<WasteCollectionEntity> {
    return this.prisma.wasteCollection.update({
      data: updateValues,
      where: whereVales,
    });
  }

  async getWasteCollectionAnalysis(): Promise<{
    totalCount: number;
    pendingCount: number;
    completedCount: number;
  }> {
    // Count of all waste collections
    const totalCount = await this.prisma.wasteCollection.count();

    // Count of pending waste collections
    const pendingCount = await this.prisma.wasteCollection.count({
      where: {
        status: 'PENDING',
      },
    });

    // Count of completed waste collections
    const completedCount = await this.prisma.wasteCollection.count({
      where: {
        status: 'COMPLETED',
      },
    });

    return {
      totalCount,
      pendingCount,
      completedCount,
    };
  }

  async getWasteTypeDistribution() {
    const totalCount = await this.prisma.wasteCollection.count();

    // Step 2: Aggregate waste collections by waste type
    const wasteTypeCounts = await this.prisma.wasteCollection.groupBy({
      by: ['wasteTypeId'],
      _count: {
        wasteTypeId: true,
      },
      orderBy: {
        _count: {
          wasteTypeId: 'desc',
        },
      },
    });

    // Fetch all WasteTypes that match the wasteTypeIds from the groupBy result
    const wasteTypeIds = wasteTypeCounts.map((wt) => wt.wasteTypeId);
    const wasteTypes = await this.prisma.wasteType.findMany({
      where: {
        id: {
          in: wasteTypeIds,
        },
      },
      select: {
        id: true,
        name: true, // Selecting only id and name for efficiency
      },
    });

    // Create a map for quick access
    const wasteTypeNameMap = wasteTypes.reduce((acc, wasteType) => {
      acc[wasteType.id] = wasteType.name;
      return acc;
    }, {});

    // Step 3: Calculate the percentage distribution and enrich with names
    const wasteTypeDistribution = wasteTypeCounts.map((wasteType) => {
      const percentage = (wasteType._count.wasteTypeId / totalCount) * 100;
      return {
        wasteTypeId: wasteType.wasteTypeId,
        count: wasteType._count.wasteTypeId,
        name: wasteTypeNameMap[wasteType.wasteTypeId] || 'Unknown', // Enriching with name
        percentage: percentage.toFixed(2) + '%', // Keeping two decimal places for readability
      };
    });

    return wasteTypeDistribution;
  }

  async getTotalWasteCollectionAmount(
    userId: string,
    status: CollectionStatus,
  ) {
    const total = await this.prisma.wasteCollection.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: userId,
        status: status,
      },
    });

    return total._sum.amount || 0; // Return 0 if null
  }
}
