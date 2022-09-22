import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { DefaultFilterOption } from 'src/util/util.dto';
import { SortType } from 'src/util/util.interface';
import { UtilService } from 'src/util/util.service';
import { CreateMovieRequest } from './movie.dto';
import { MovieListResponse, MovieResponse } from './movie.interface';
import { Movie } from './movie.schema';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const http = require('http');
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const https = require('https');

function convertImageToBase64(image: string): string {
  if (!image) return undefined;
  return image;
  // return new Promise((resolve, reject) => {
  //   let body;

  //   let protocol: typeof https | typeof http = http;

  //   if (image.includes('https://')) protocol = https;

  //   protocol
  //     .get(image, (resp) => {
  //       resp.setEncoding('base64');
  //       body = 'data:' + resp.headers['content-type'] + ';base64,';
  //       resp.on('data', (data) => {
  //         body += data;
  //       });
  //       resp.on('end', () => {
  //         resolve(body);
  //         console.log(body);
  //         //return res.json({result: body, status: 'success'});
  //       });
  //     })
  //     .on('error', (e) => {
  //       console.log(`Got error: ${e.message}`);
  //       reject(`Got error: ${e.message}`);
  //     });
  // });
}

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private model: Model<Movie>,
    private utilService: UtilService,
  ) {}

  async findAll(
    params: DefaultFilterOption,
    user: User,
  ): Promise<MovieListResponse> {
    try {
      const page = Number(params.page);
      const limit = params.limit ? Number(params.limit) : undefined;
      const skip = page ? (page - 1) * limit : undefined;

      let sort: any = { _id: -1 };
      const where: any = {};

      if (params.search) {
        where.name = {
          $regex: params.search,
          $options: 'i',
        };
      }

      if (params.sort) {
        const str = params.sort.split(',');
        sort = {
          [str[0]]: str[1] === SortType.asc ? 1 : -1,
        };
      }

      const [movies] = await this.model.aggregate([
        { $match: where },
        {
          $lookup: {
            from: 'favourites',
            let: { movieId: '$_id' }, // localfield
            as: 'isFav',
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$movie', '$$movieId'],
                  },
                },
              },
              {
                $match: {
                  $expr: {
                    $eq: ['$user', user._id],
                  },
                },
              },
            ],
          },
        },
        { $unwind: { path: '$isFav', preserveNullAndEmptyArrays: true } },
        {
          $sort: sort,
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              ...(page && limit ? [{ $skip: skip }, { $limit: limit }] : []),
              {
                $addFields: {
                  isFav: {
                    $ifNull: [{ $toBool: '$isFav' }, false],
                  },
                },
              },
            ],
          },
        },
        {
          $project: {
            total: { $arrayElemAt: ['$metadata.total', 0] },
            entries: '$data',
          },
        },
      ]);

      return this.utilService.responseMany({ page, limit, ...movies });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message, error);
    }
  }

  async findOne(id: string): Promise<MovieResponse> {
    try {
      const movie = await await this.model.findById(id);
      if (!movie) {
        throw new NotFoundException('Movie does not exists');
      }
      return this.utilService.responseOne(movie);
    } catch (error) {
      throw new BadRequestException(error.message, error);
    }
  }

  async create(payload: CreateMovieRequest): Promise<MovieResponse> {
    try {
      const movie = await this.model.create(payload);
      return this.utilService.responseOne(movie);
    } catch (error) {
      throw new BadRequestException(error.message, error);
    }
  }

  async importAll(payload: any): Promise<MovieResponse> {
    try {
      // const count = await this.model.countDocuments();
      // if (count > 0) {
      //   throw new BadRequestException('Already exists movies');
      // }
      await this.model.insertMany(payload, { ordered: false });
      return this.utilService.responseOne();
    } catch (error) {
      throw new BadRequestException(error.message, error);
    }
  }

  async createBulkMovie(
    payload: [CreateMovieRequest],
  ): Promise<MovieListResponse> {
    try {
      const data: any[] = [];
      for (const item of payload) {
        const banner = await convertImageToBase64(
          `https://image.tmdb.org/t/p/w185${item.poster_path}`,
        );
        data.push({
          name: item.name || item.title || item.original_title,
          description: item.overview,
          cover: item.cover || banner,
          ...item,
        });
      }

      const movies = await this.model.insertMany(data, { ordered: false });
      return this.utilService.responseMany({ entries: movies });
    } catch (error) {
      throw new BadRequestException(error.message, error);
    }
  }

  async deleteAllMovie(): Promise<any> {
    return this.model.deleteMany({});
  }

  async getMyMovie(user: User): Promise<MovieListResponse> {
    try {
      const movies = await this.model.find({ user: user._id });
      return this.utilService.responseMany({ entries: movies });
    } catch (error) {
      console.log('ERR', error);
      throw new BadRequestException(error.message, error);
    }
  }

  async update(id: string, payload: Movie): Promise<Movie> {
    return this.model.findByIdAndUpdate(id, payload);
  }
}
