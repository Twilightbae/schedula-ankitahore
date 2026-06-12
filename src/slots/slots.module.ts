import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';

import { Doctor } from '../doctor/doctor.entity';
import { Availability } from '../availability/availability.entity';
import { AvailabilityOverride } from '../availability/availability-override.entity';
import { Appointment } from '../appointment/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Doctor,
      Availability,
      AvailabilityOverride,
      Appointment,
    ]),
  ],
  controllers: [SlotsController],
  providers: [SlotsService],
})
export class SlotsModule {}