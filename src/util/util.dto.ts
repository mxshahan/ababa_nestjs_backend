import { IsNotEmpty, Matches } from 'class-validator';
export class DefaultFilterOption {
  page?: number;
  limit?: number;
  search?: string;

  sort?: `${string},${string}`;
}
