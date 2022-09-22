import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser } from 'src/user/user.decorator';
import { RegisterUserRequest } from 'src/user/user.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { UtilService } from 'src/util/util.service';
import { User } from 'src/user/user.schema';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly utilService: UtilService,
  ) {}

  @Post('registerAdmin')
  async registerAdmin(
    @Body() payload: RegisterUserRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const user = await this.authService.registerAdmin(payload);
    // await this.authService.login(user, response);
    response.send(this.utilService.responseOne(user));
  }

  @Post('register')
  async register(
    @Body() payload: RegisterUserRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const user = await this.authService.register(payload);
    await this.authService.login(user, response);
    response.send(this.utilService.responseOne(user));
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.login(user, response);
    response.send(this.utilService.responseOne(user));
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logout(user, response);
    response.send(this.utilService.responseOne());
  }

  @UseGuards(JwtAuthGuard)
  @Get('checkAuthorization')
  async checkAuthorization(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    response.send(this.utilService.responseOne(user));
  }
}
