import { Injectable } from '@nestjs/common';
import {
  IGetAllWasteCollection,
  WasteCollectionRepository,
} from './waste-collection.repository';
import { CreateWasteCollectionDto, UpdateWasteCollectionDto } from './dto';
import { WasteCollectionEntity } from 'src/entities/waste-collection.entity';
import { EmailService } from 'src/email/email.service';
import { UserRepository } from '../user/user.repository';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WasteCollectionService {
  constructor(
    private wasteCollectionRepo: WasteCollectionRepository,
    private emailService: EmailService,
    private userRepository: UserRepository,
    private config: ConfigService,
  ) {}

  async getAll(queryParams: IGetAllWasteCollection) {
    try {
      return await this.wasteCollectionRepo.getAll(queryParams);
    } catch (error) {
      return error;
    }
  }

  async createWasteCollection(wasteCollectionData: CreateWasteCollectionDto) {
    try {
      const { collectionDate, amount, status, userId, wasteTypeId } =
        wasteCollectionData;

      const wasteCollection = new WasteCollectionEntity(
        collectionDate,
        amount,
        status,
        userId,
        wasteTypeId,
      );

      const wasteCreationResponse =
        await this.wasteCollectionRepo.createWasteCollection(wasteCollection);

      const pendingWasteCollectionAmount =
        await this.wasteCollectionRepo.getTotalWasteCollectionAmount(
          userId,
          'PENDING',
        );

      const userDetails = await this.userRepository.getUserById(userId);
      if (
        pendingWasteCollectionAmount >= 50 &&
        pendingWasteCollectionAmount < 75
      ) {
        // send mail for 50 percent
        const emailBody = this.emailService.generateEmailBody(
          userDetails.name,
          userDetails.email,
          userDetails.phoneNumber,
          moment().format('DD MMM YYYY HH:mm'),
          50,
          pendingWasteCollectionAmount,
        );

        this.emailService.sendMail(
          this.config.get('EMAIL'),
          'Threshold exceeded 50 % ',
          emailBody,
        );
      } else if (
        pendingWasteCollectionAmount >= 75 &&
        pendingWasteCollectionAmount < 90
      ) {
        const emailBody = this.emailService.generateEmailBody(
          userDetails.name,
          userDetails.email,
          userDetails.phoneNumber,
          moment().format('DD MMM YYYY HH:mm'),
          75,
          pendingWasteCollectionAmount,
        );

        this.emailService.sendMail(
          this.config.get('EMAIL'),
          'Threshold exceeded 75 % ',
          emailBody,
        );
      } else if (
        pendingWasteCollectionAmount >= 90 &&
        pendingWasteCollectionAmount <= 100
      ) {
        const emailBody = this.emailService.generateEmailBody(
          userDetails.name,
          userDetails.email,
          userDetails.phoneNumber,
          moment().format('DD MMM YYYY HH:mm'),
          90,
          pendingWasteCollectionAmount,
        );

        this.emailService.sendMail(
          this.config.get('EMAIL'),
          'Threshold exceeded 50 % ',
          emailBody,
        );
      }

      return wasteCreationResponse;
    } catch (error) {
      return error;
    }
  }

  async getWasteCollection(id: string) {
    try {
      return await this.wasteCollectionRepo.getWasteCollection({ id });
    } catch (error) {
      return error;
    }
  }

  async updateWasteCollection(
    id: string,
    updateBody: UpdateWasteCollectionDto,
  ) {
    try {
      return await this.wasteCollectionRepo.updateWasteCollection(
        { id },
        updateBody,
      );
    } catch (error) {
      return error;
    }
  }

  async getWasteCollectionAnalysis() {
    try {
      return await this.wasteCollectionRepo.getWasteCollectionAnalysis();
    } catch (error) {
      return error;
    }
  }
  async getWasteTypeDistribution() {
    try {
      return await this.wasteCollectionRepo.getWasteTypeDistribution();
    } catch (error) {
      return error;
    }
  }
}
