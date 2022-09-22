import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { RegisterUserRequest } from 'src/user/user.dto';
import { Injectable } from '@nestjs/common';
import { User, UserRole } from 'src/user/user.schema';

export interface TokenPayload {
  userId: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(user: User, response: Response): Promise<void> {
    const tokenPayload: TokenPayload = {
      userId: user._id,
      role: user.role,
    };

    const expires = new Date();
    expires.setHours(
      expires.getHours() + this.configService.get('JWT_EXPIRES_IN') * 24,
    );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authorization', token, {
      httpOnly: true,
      expires,
    });
  }

  async logout(user: User, response: Response): Promise<void> {
    response.clearCookie('Authorization', { httpOnly: true });
  }

  async register(payload: RegisterUserRequest): Promise<User> {
    return this.userService.createUser(payload);
  }

  async registerAdmin(payload: RegisterUserRequest): Promise<User> {
    return this.userService.createAdminUser(payload);
  }
}
