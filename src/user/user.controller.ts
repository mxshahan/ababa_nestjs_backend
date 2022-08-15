import { UserResponse } from 'src/user/user.interface';
import { UserService } from 'src/user/user.service';
import {
  Controller,
  Get,
  NotFoundException,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from './user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUser(
    @CurrentUser() user: UserResponse,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (user) {
      response.send(user);
    } else {
      throw new NotFoundException('User not found');
    }
  }
}
