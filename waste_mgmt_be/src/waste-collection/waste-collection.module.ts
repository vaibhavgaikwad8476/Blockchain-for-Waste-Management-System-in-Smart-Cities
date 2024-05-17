import { Module } from '@nestjs/common';
import { WasteCollectionController } from './waste-collection.controller';
import { WasteCollectionService } from './waste-collection.service';
import { WasteCollectionRepository } from './waste-collection.repository';
import { EmailService } from 'src/email/email.service';
import { UserRepository } from 'src/user/user.repository';

@Module({
  controllers: [WasteCollectionController],
  providers: [
    WasteCollectionService,
    WasteCollectionRepository,
    EmailService,
    UserRepository,
  ],
})
export class WasteCollectionModule {}
