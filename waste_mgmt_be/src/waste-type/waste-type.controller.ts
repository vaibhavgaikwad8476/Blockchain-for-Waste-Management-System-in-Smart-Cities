import { Controller, Get, UseGuards } from '@nestjs/common';
import { WasteTypeService } from './waste-type.service';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('waste-types')
export class WasteTypeController {
  constructor(private wasteTypeService: WasteTypeService) {}

  @Get('')
  getAllWasteTypes() {
    return this.wasteTypeService.getAllWasteTypes();
  }
}
