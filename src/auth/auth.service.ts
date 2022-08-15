import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { RegisterUserRequest } from 'src/user/user.dto';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.schema';

export interface TokenPayload {
  userId: string;
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

  async register(payload: RegisterUserRequest): Promise<User> {
    return this.userService.createUser(payload);
  }
}
