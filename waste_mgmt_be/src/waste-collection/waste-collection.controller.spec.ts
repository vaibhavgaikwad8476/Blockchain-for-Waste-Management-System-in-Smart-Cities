import { Test, TestingModule } from '@nestjs/testing';
import { WasteCollectionController } from './waste-collection.controller';

describe('WasteCollectionController', () => {
  let controller: WasteCollectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WasteCollectionController],
    }).compile();

    controller = module.get<WasteCollectionController>(
      WasteCollectionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
