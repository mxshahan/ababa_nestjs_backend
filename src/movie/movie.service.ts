import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { DefaultFilterOption, SortType } from 'src/util/util.interface';
import { UtilService } from 'src/util/util.service';
import { CreateMovieRequest } from './movie.dto';
import { MovieListResponse, MovieResponse } from './movie.interface';
import { Movie } from './movie.schema';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private model: Model<Movie>,
    private utilService: UtilService,
  ) {}

  async findAll({
    page,
    limit,
    sort,
    search,
  }: DefaultFilterOption): Promise<MovieListResponse> {
    try {
      console.log({ page, limit, sort, search, SortType });
      const offset = page - 1;
      const sortBy = {};
      const where: any = {};

      if (search) {
        where.name = {
          $regex: search,
          $options: 'i',
        };
      }

      if (sort) {
        sortBy[sort[0]] = sort[1] === SortType.asc ? 1 : -1;
      }

      const total = await this.model.countDocuments(where);
      const movies = await this.model
        .find(where)
        .populate('user')
        .skip(offset * limit)
        .limit(limit);
      return this.utilService.responseMany({ entries: movies, total });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message, error);
    }
  }

  async findOne(id: string): Promise<MovieResponse> {
    try {
      const movie = await this.model.findById(id);
      if (!movie) {
        throw new NotFoundException('Movie does not exists');
      }
      return this.utilService.responseOne(movie);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async create(
    payload: CreateMovieRequest,
    user: User,
  ): Promise<MovieResponse> {
    try {
      const movie = await this.model.create({ user: user._id, ...payload });
      return this.utilService.responseOne(movie);
    } catch (error) {
      throw new BadRequestException(error.message, error);
    }
  }

  async getMyMovie(user: User): Promise<MovieListResponse> {
    try {
      const movies = await this.model.find({ user: user._id }).populate('user');
      return this.utilService.responseMany({ entries: movies });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: string, payload: Movie): Promise<Movie> {
    return this.model.findByIdAndUpdate(id, payload);
  }
}
