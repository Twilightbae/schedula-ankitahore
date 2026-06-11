import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Availability } from './availability.entity';
import { AvailabilityOverride } from './availability-override.entity';
import { Doctor } from '../doctor/doctor.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private availabilityRepo: Repository<Availability>,

    @InjectRepository(AvailabilityOverride)
    private overrideRepo: Repository<AvailabilityOverride>,

    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
  ) {}

  async createAvailability(data: Availability) {
    const doctor = await this.doctorRepo.findOne({
      where: { id: data.doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (data.startTime >= data.endTime) {
      throw new BadRequestException('Invalid time range');
    }

    const existing = await this.availabilityRepo.find({
      where: {
        doctorId: data.doctorId,
        dayOfWeek: data.dayOfWeek,
      },
    });

    const duplicate = existing.find(
      slot =>
        slot.startTime === data.startTime &&
        slot.endTime === data.endTime,
    );

    if (duplicate) {
      throw new BadRequestException('Duplicate availability');
    }

    const overlap = existing.some(
      slot =>
        data.startTime < slot.endTime &&
        data.endTime > slot.startTime,
    );

    if (overlap) {
      throw new BadRequestException('Overlapping slot');
    }

    return this.availabilityRepo.save(data);
  }

  async createOverride(data: AvailabilityOverride) {
    const doctor = await this.doctorRepo.findOne({
      where: { id: data.doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (isNaN(Date.parse(data.date))) {
      throw new BadRequestException('Invalid date');
    }

    if (data.startTime >= data.endTime) {
      throw new BadRequestException('Invalid time range');
    }

    const existing = await this.overrideRepo.find({
      where: {
        doctorId: data.doctorId,
        date: data.date,
      },
    });

    const duplicate = existing.find(
      slot =>
        slot.startTime === data.startTime &&
        slot.endTime === data.endTime,
    );

    if (duplicate) {
      throw new BadRequestException('Duplicate availability');
    }

    const overlap = existing.some(
      slot =>
        data.startTime < slot.endTime &&
        data.endTime > slot.startTime,
    );

    if (overlap) {
      throw new BadRequestException('Overlapping override slot');
    }

    return this.overrideRepo.save(data);
  }

  async getRecurring(doctorId: number) {
    return this.availabilityRepo.find({
      where: { doctorId },
    });
  }

  async getOverrides(doctorId: number) {
    return this.overrideRepo.find({
      where: { doctorId },
    });
  }
}