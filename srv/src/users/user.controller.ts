import { Controller, Get, Logger, ParseIntPipe, Query } from '@nestjs/common';
import { UsersResponseDto } from './users.response.dto';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {
  }

  @Get()
  async getAllUsers(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    this.logger.log(`Get users page ${page}, limit ${limit}`);
    const { users, totalCount } = await this.userService.findAndCountAll(page, limit);
    const usersResponseDto = users.map((user) => UsersResponseDto.fromUsersEntity(user));

    return { users: usersResponseDto, totalCount };
  }
}
