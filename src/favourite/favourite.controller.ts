import {
  Controller,
  Delete,
  Get,
  Param,
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
import { FavouriteService } from './favourite.service';

@Controller('favs')
export class FavouriteController {
  constructor(private favService: FavouriteService) {}
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseRoles('user')
  getMyFavourites(
    @Query() query: DefaultFilterOption,
    @CurrentUser() user: User,
  ) {
    return this.favService.getMyFavourites(query, user);
  }

  /**
   * This controller will add or delete favourite to my list
   */
  @Post('toggle/:movieId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseRoles('user')
  toggleFavourite(
    @Param('movieId') movieId: string,
    @CurrentUser() user: User,
  ) {
    return this.favService.toggleFavourite(movieId, user);
  }
}
