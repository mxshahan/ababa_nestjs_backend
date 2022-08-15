export interface UserType {
  _id?: string;
  email?: string;
  name?: string;
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
