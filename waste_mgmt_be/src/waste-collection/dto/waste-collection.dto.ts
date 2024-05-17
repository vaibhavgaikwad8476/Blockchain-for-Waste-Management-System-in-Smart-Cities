import { CollectionStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWasteCollectionDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsDateString()
  collectionDate: Date;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsEnum(CollectionStatus)
  status: CollectionStatus;

  @IsNotEmpty()
  wasteTypeId: string;
}

export class UpdateWasteCollectionDto {
  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  collectionDate: Date;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsEnum(CollectionStatus)
  status: CollectionStatus;

  @IsOptional()
  vehicleId: string;
}

export class GetAllWasteCollectionDto {
  @IsOptional()
  @IsString()
  status: CollectionStatus;

  @IsInt()
  @Type(() => Number)
  page: number;

  @IsInt()
  @Type(() => Number)
  limit: number;

  @IsString()
  @IsOptional()
  userId: string;
}
