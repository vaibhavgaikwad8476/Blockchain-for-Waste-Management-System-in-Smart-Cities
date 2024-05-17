import { UserRole, UserType } from '@prisma/client';

export class UserEntity {
  public id?: any;
  public email: string;
  public name: string;
  public role: UserRole;
  public password: string;
  public type: UserType;
  public address?: string;
  public locationCoordinates?: number[];
  public phoneNumber?: string;

  constructor(
    email: string,
    name: string,
    password: string,
    address: string,
    phoneNumber: string,
    locationCoordinates: number[],
    type: UserType,
  ) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.locationCoordinates = locationCoordinates;
    this.type = type;
  }
}
