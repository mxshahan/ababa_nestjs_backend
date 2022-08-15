import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;
}
