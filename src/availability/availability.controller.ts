import {
  Controller,
  Post,
  Body,
  Get,
  Param,
} from '@nestjs/common';

import { AvailabilityService } from './availability.service';

@Controller('availability')
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
  ) {}

  @Post('recurring')
  createRecurring(@Body() body: any) {
    return this.availabilityService.createAvailability(body);
  }

  @Post('override')
  createOverride(@Body() body: any) {
    return this.availabilityService.createOverride(body);
  }

  @Get('recurring/:doctorId')
  getRecurring(@Param('doctorId') doctorId: number) {
    return this.availabilityService.getRecurring(Number(doctorId));
  }

  @Get('override/:doctorId')
  getOverride(@Param('doctorId') doctorId: number) {
    return this.availabilityService.getOverrides(Number(doctorId));
  }
}