import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WasteCollectionService } from './waste-collection.service';
import {
  CreateWasteCollectionDto,
  GetAllWasteCollectionDto,
  UpdateWasteCollectionDto,
} from './dto';
import { JwtGuard } from 'src/auth/guard';

@Controller('waste-collections')
@UseGuards(JwtGuard)
export class WasteCollectionController {
  constructor(private wasteCollectionService: WasteCollectionService) {}

  @Get('')
  getAllWasteCollections(@Query() queryParameters: GetAllWasteCollectionDto) {
    return this.wasteCollectionService.getAll(queryParameters);
  }

  @Post()
  createWasteCollection(@Body() dto: CreateWasteCollectionDto) {
    const response = this.wasteCollectionService.createWasteCollection(dto);
    return response;
  }

  @Get(':id')
  getWasteCollection(@Param() params: { id: string }) {
    return this.wasteCollectionService.getWasteCollection(params.id);
  }

  @Put(':id')
  updateWasteCollection(
    @Param() params: { id: string },
    @Body() dto: UpdateWasteCollectionDto,
  ) {
    return this.wasteCollectionService.updateWasteCollection(params.id, dto);
  }

  @Get('/analysis/count')
  getWasteCollectionAnalysis() {
    return this.wasteCollectionService.getWasteCollectionAnalysis();
  }

  @Get('/analysis/waste-types')
  getWasteTypeDistribution() {
    return this.wasteCollectionService.getWasteTypeDistribution();
  }
}
