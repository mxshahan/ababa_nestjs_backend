import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { compareSync } from 'bcrypt';
import { Model } from 'mongoose';

import { RegisterUserRequest } from './user.dto';
import { UserType } from './user.interface';
import { User, UserRole } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly model: Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.model.find();
  }

  async findOne(query: UserType): Promise<User> {
    return this.model.findOne(query);
  }

  async findById(id: string): Promise<User> {
    return this.model.findById(id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.model.findOne({ email });
  }

  async update(id: string, payload: User): Promise<User> {
    return this.model.findByIdAndUpdate(id, payload);
  }

  async create(payload: Partial<User>): Promise<User> {
    return this.model.create(payload);
  }

  async createAdminUser(payload: RegisterUserRequest): Promise<User> {
    try {
      let user = await this.findOne({ role: UserRole.admin });
      if (user) {
        throw new BadRequestException('Admin already exists');
      }

      user = await this.create({ ...payload, role: UserRole.admin });
      return user;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message, error);
    }
  }

  async createUser(payload: RegisterUserRequest): Promise<User> {
    let user = await this.findOneByEmail(payload.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    user = await this.create(payload);
    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('User does not exists');
    }

    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('User does not found');
    }

    const isValidPassword = compareSync(password, user.password);
    if (!isValidPassword) {
      throw new BadRequestException('Password does not matched');
    }

    return user;
  }
}
