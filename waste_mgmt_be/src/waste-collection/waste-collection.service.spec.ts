import { Test, TestingModule } from '@nestjs/testing';
import { WasteCollectionService } from './waste-collection.service';

describe('WasteCollectionService', () => {
  let service: WasteCollectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WasteCollectionService],
    }).compile();

    service = module.get<WasteCollectionService>(WasteCollectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
