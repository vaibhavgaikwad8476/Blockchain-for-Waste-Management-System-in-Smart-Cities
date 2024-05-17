import { Injectable } from '@nestjs/common';
import { WasteTypeRepository } from './waste-type.repository';
import { WasteType } from '@prisma/client';

@Injectable()
export class WasteTypeService {
  constructor(private wasteTypeRepo: WasteTypeRepository) {}

  async getAllWasteTypes(): Promise<WasteType[]> {
    return await this.wasteTypeRepo.getAll();
  }
}
