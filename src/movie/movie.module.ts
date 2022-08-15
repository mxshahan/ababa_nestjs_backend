import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilService } from 'src/util/util.service';
import { MovieController } from './movie.controller';
import { Movie, MovieSchema } from './movie.schema';
import { MovieService } from './movie.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [MovieController],
  providers: [MovieService, UtilService],
})
export class MovieModule {}
