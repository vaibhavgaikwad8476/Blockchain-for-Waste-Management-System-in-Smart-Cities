import { Test, TestingModule } from '@nestjs/testing';
import { WasteTypeController } from './waste-type.controller';

describe('WasteTypeController', () => {
  let controller: WasteTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WasteTypeController],
    }).compile();

    controller = module.get<WasteTypeController>(WasteTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
