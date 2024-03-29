import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import ExtendedReq from 'src/models/ExtendedReq';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Req() req: ExtendedReq,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return this.wishlistsService.create(req.user.id, createWishlistDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: number) {
    return this.wishlistsService.findOneById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateOneById(
    @Req() req: ExtendedReq,
    @Param('id') wishId: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const updatedWishlist = await this.wishlistsService.updateById(
      req.user.id,
      wishId,
      updateWishlistDto,
    );

    if (updatedWishlist) {
      return updatedWishlist;
    } else {
      return { message: 'No rows were updated.' };
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteOneById(@Req() req: ExtendedReq, @Param('id') wishId: number) {
    const deleteResult = await this.wishlistsService.deleteOneById(
      req.user.id,
      wishId,
    );

    if (deleteResult.affected > 0) {
      return { message: 'delete was successful.' };
    } else {
      return { message: 'No rows were deleted.' };
    }
  }
}
