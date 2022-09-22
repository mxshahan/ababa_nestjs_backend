import { UserRole } from './user.schema';

export interface UserType {
  _id?: string;
  email?: string;
  name?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserResponse {
  success: boolean;
  entry: UserType;
}

export interface UserListResponse {
  success: boolean;
  entries: UserType[];
  page?: number;
  total?: number;
}
