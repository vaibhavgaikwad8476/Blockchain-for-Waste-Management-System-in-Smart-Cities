import { Module } from '@nestjs/common';
import { WasteTypeController } from './waste-type.controller';
import { WasteTypeService } from './waste-type.service';
import { WasteTypeRepository } from './waste-type.repository';

@Module({
  controllers: [WasteTypeController],
  providers: [WasteTypeService, WasteTypeRepository],
})
export class WasteTypeModule {}
