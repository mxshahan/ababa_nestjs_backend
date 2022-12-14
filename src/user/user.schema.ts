import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Document } from 'mongoose';

export enum UserRole {
  user = 'user',
  admin = 'admin',
}

@Schema({ versionKey: false, timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ minlength: 6, required: true })
  password: string;

  @Prop({ required: true, default: () => UserRole.user })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 12);
  }
});

UserSchema.methods = {
  toJSON() {
    const user = this.toObject();
    delete user.password;
    return user;
  },
};
