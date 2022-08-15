import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/user/user.decorator';
import { User } from 'src/user/user.schema';
import { DefaultFilterOption } from 'src/util/util.interface';
import { CreateMovieRequest } from './movie.dto';
import { MovieListResponse, MovieResponse } from './movie.interface';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createMovie(@CurrentUser() user: User, @Body() payload: CreateMovieRequest) {
    return this.movieService.create(payload, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getMyMovies(@CurrentUser() user: User) {
    return this.movieService.getMyMovie(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateMovie(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteMovie(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @Get('/all')
  getMovies(@Query() query: DefaultFilterOption): Promise<MovieListResponse> {
    return this.movieService.findAll(query);
  }

  @Get(':id')
  getMovie(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }
}
