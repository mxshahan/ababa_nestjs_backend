import { UserType } from 'src/user/user.interface';

export interface MovieType {
  _id: string;
  name: string;
  description: string;
  user: UserType;
}

export interface MovieResponse {
  success: boolean;
  entry: MovieType;
}

export interface MovieListResponse {
  success: boolean;
  entries: MovieType[];
  page?: number;
  total?: number;
}

export interface MovieFilterOption {
  search: string;
}
