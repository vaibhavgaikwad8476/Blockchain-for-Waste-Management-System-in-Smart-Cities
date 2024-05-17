import { Test, TestingModule } from '@nestjs/testing';
import { WasteType } from './waste-type.service';

describe('WasteType', () => {
  let provider: WasteType;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WasteType],
    }).compile();

    provider = module.get<WasteType>(WasteType);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
