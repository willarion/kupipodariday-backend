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
import ExtendedReq from 'src/models/ExtendedReq';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req: ExtendedReq, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(req.user.id, createWishDto);
  }

  @UseGuards(JwtGuard)
  @Get('last')
  async getLatestWish(@Req() req: ExtendedReq) {
    const latestWish = await this.wishesService.findLatestWishByUserId(
      req.user.id,
    );
    return latestWish;
  }

  @Get('top')
  async getTopWishes() {
    const topWishes = await this.wishesService.findTopWishes();
    return topWishes;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOneById(@Req() req: ExtendedReq, @Param('id') wishId: number) {
    const wish = await this.wishesService.findOneById(req.user.id, wishId);
    return wish;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateOneById(
    @Req() req: ExtendedReq,
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
      return { message: 'No rows were updated.' };
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteOneById(@Req() req: ExtendedReq, @Param('id') wishId: number) {
    const deleteResult = await this.wishesService.deleteOneById(
      req.user.id,
      wishId,
    );

    if (deleteResult.affected > 0) {
      return { message: 'delete was successful.' };
    } else {
      return { message: 'No rows were deleted.' };
    }
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Param('id') id: number, @Req() request: ExtendedReq) {
    return this.wishesService.copyWish(id, request.user.id);
  }
}
