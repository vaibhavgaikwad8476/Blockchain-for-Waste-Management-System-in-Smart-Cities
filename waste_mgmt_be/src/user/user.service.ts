import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}
  getAllUsers() {
    return this.userRepo.getAllUsers();
  }

  getUserById(userId: string) {
    return this.userRepo.getUserById(userId);
  }
}
