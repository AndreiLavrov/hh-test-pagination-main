import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users
  async findAndCountAll(page: number = 1, limit: number = 10): Promise<{ users: UsersEntity[]; totalCount: number }> {
    const [users, totalCount] = await this.usersRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { users, totalCount };
  }
}
