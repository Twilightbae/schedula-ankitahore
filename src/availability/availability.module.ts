import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Availability } from './availability.entity';
import { AvailabilityOverride } from './availability-override.entity';

import { Doctor } from '../doctor/doctor.entity';

import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Availability,
      AvailabilityOverride,
      Doctor,
    ]),
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
})
export class AvailabilityModule {}