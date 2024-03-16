import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req: any, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(req.user.id, createWishDto);
  }

  @UseGuards(JwtGuard)
  @Get('last')
  async getLatestWish(@Req() req: any) {
    const latestWish = await this.wishesService.findLatestWishByUserId(
      req.user.id,
    );
    if (!latestWish) {
      // TODO update errors
      return { statusCode: 404, message: 'No wishes found for this user.' };
    }
    return latestWish;
  }

  @Get('top')
  async getTopWishes() {
    const topWishes = await this.wishesService.findTopWishes();
    if (!topWishes) {
      // TODO update errors
      return { statusCode: 404, message: 'No wishes found.' };
    }
    return topWishes;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOneById(@Req() req: any, @Param('id') wishId: number) {
    const wish = await this.wishesService.findOneById(req.user.id, wishId);
    if (!wish) {
      // TODO update errors
      return { statusCode: 404, message: 'No wish found.' };
    }
    return wish;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateOneById(
    @Req() req: any,
    @Param('id') wishId: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const updateResult = await this.wishesService.updateById(
      req.user.id,
      wishId,
      updateWishDto,
    );

    if (updateResult) {
      return { message: 'Update was successful.' };
    } else {
      // TODO add error
      return { message: 'No rows were updated.' };
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteOneById(@Req() req: any, @Param('id') wishId: number) {
    const deleteResult = await this.wishesService.deleteOneById(
      req.user.id,
      wishId,
    );

    if (deleteResult.affected > 0) {
      return { message: 'delete was successful.' };
    } else {
      // TODO add error
      return { message: 'No rows were deleted.' };
    }
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Param('id') id: number, @Req() request: any) {
    return this.wishesService.copyWish(id, request.user.id);
  }
}
