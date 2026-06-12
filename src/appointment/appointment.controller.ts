import {
  Controller,
  Post,
  Get,
  Body,
} from '@nestjs/common';

import { AppointmentService } from './appointment.service';

@Controller('appointment')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.appointmentService.create(
      body,
    );
  }

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }
}