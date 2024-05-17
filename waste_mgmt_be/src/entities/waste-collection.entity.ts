import { CollectionStatus } from '@prisma/client';

export class WasteCollectionEntity {
  public collectionDate: Date;
  public amount: number;
  public status: CollectionStatus;
  public userId: string;
  public wasteTypeId: string;

  constructor(
    collectionDate: Date,
    amount: number,
    status: CollectionStatus,
    userId: string,
    wasteTypeId: string,
  ) {
    this.collectionDate = collectionDate;
    this.amount = amount;
    this.status = status;
    this.userId = userId;
    this.wasteTypeId = wasteTypeId;
  }
}
