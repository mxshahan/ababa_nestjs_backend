import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Movie } from 'src/movie/movie.schema';
import { User } from 'src/user/user.schema';

@Schema({ versionKey: false, timestamps: true })
export class Favourite extends Document {
  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: User.name,
  })
  user: User;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Movie.name,
  })
  movie: Movie;
}

export const FavouriteSchema = SchemaFactory.createForClass(Favourite);
