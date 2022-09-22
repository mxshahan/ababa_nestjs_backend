import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilService } from 'src/util/util.service';
import { FavouriteController } from './favourite.controller';
import { Favourite, FavouriteSchema } from './favourite.schema';
import { FavouriteService } from './favourite.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Favourite.name, schema: FavouriteSchema },
    ]),
  ],
  controllers: [FavouriteController],
  providers: [FavouriteService, UtilService],
})
export class FavouriteModule {}
