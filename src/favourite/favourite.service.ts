import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SchemaTypes } from 'mongoose';
import { User } from 'src/user/user.schema';
import { DefaultFilterOption } from 'src/util/util.dto';
import { SortType } from 'src/util/util.interface';
import { UtilService } from 'src/util/util.service';
import { Favourite } from './favourite.schema';

@Injectable()
export class FavouriteService {
  constructor(
    @InjectModel(Favourite.name) private model: Model<Favourite>,
    private utilService: UtilService,
  ) {}

  async getMyFavourites(params: DefaultFilterOption, user: User) {
    try {
      const page = Number(params.page);
      const limit = params.limit ? Number(params.limit) : undefined;
      const skip = page ? (page - 1) * limit : undefined;

      let sort: any = { _id: -1 };
      const where: any = {
        user: user._id,
      };

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

      const total = await this.model.countDocuments(where);
      const favs = await this.model
        .find(where)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate('movie');

      return this.utilService.responseMany({ total, page, entries: favs });
    } catch (error) {
      throw new BadRequestException(error.message, error);
    }
  }

  async toggleFavourite(movieId: string, user: User) {
    try {
      let fav = await this.model.findOne({
        user: user._id,
        movie: movieId,
      });
      if (fav) {
        await fav.remove();
        return this.utilService.responseOne(
          fav,
          'Successfully removed from favourite',
        );
      } else {
        fav = await this.model.create({
          user: user._id,
          movie: movieId,
        });
      }

      return this.utilService.responseOne(
        fav,
        'Successfully added to favourites',
      );
    } catch (error) {
      throw new BadRequestException(error.message, error);
    }
  }
}
