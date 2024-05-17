import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { WasteCollectionModule } from './waste-collection/waste-collection.module';
import { WasteTypeModule } from './waste-type/waste-type.module';
import { EventsGateway } from './events/events.gateway';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    PrismaModule,
    WasteCollectionModule,
    WasteTypeModule,
    EmailModule,
  ],
  controllers: [],
  providers: [EventsGateway],
})
export class AppModule {}
