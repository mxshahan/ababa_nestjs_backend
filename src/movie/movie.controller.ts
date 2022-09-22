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
import { UseRoles } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/user/user.decorator';
import { User } from 'src/user/user.schema';
import { DefaultFilterOption } from 'src/util/util.dto';
import { CreateMovieRequest } from './movie.dto';
import { MovieListResponse } from './movie.interface';
import { MovieService } from './movie.service';
import { MovieMock } from './movie.mock';

@Controller('movie')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly mockService: MovieMock,
  ) {}

  @Get('import')
  importMovie() {
    return this.movieService.importAll(this.mockService.get());
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseRoles('admin')
  createMovie(@Body() payload: CreateMovieRequest) {
    return this.movieService.create(payload);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseRoles('admin')
  createBulkMovie(@Body() payload: [CreateMovieRequest]) {
    return this.movieService.createBulkMovie(payload);
  }

  @Delete('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseRoles('admin')
  deleteAllMovie() {
    return this.movieService.deleteAllMovie();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseRoles('admin')
  updateMovie(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseRoles('admin')
  deleteMovie(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @Get('fav')
  @UseGuards(JwtAuthGuard)
  getMyFavMovies(@CurrentUser() user: User) {
    return this.movieService.getMyMovie(user);
  }

  @Get('all')
  // @Public() // TODO
  @UseGuards(JwtAuthGuard)
  getMovies(
    @Query() query: DefaultFilterOption,
    @CurrentUser() user: User,
  ): Promise<MovieListResponse> {
    return this.movieService.findAll(query, user);
  }

  @Get(':id')
  getMovie(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }
}
