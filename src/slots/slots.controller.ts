import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { SlotsService } from './slots.service';

@Controller('slots')
export class SlotsController {
  constructor(
    private readonly slotsService: SlotsService,
  ) {}

  @Get(':doctorId')
  getSlots(
    @Param('doctorId')
    doctorId: string,

    @Query('date')
    date: string,
  ) {
    return this.slotsService.getSlots(
      Number(doctorId),
      date,
    );
  }
}