import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Doctor } from '../doctor/doctor.entity';
import { Availability } from '../availability/availability.entity';
import { AvailabilityOverride } from '../availability/availability-override.entity';
import { Appointment } from '../appointment/appointment.entity';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,

    @InjectRepository(Availability)
    private availabilityRepo: Repository<Availability>,

    @InjectRepository(AvailabilityOverride)
    private overrideRepo: Repository<AvailabilityOverride>,

    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  generateSlots(
    startTime: string,
    endTime: string,
    duration = 15,
  ): string[] {
    const slots: string[] = [];

    const [startHour, startMinute] = startTime
      .split(':')
      .map(Number);

    const [endHour, endMinute] = endTime
      .split(':')
      .map(Number);

    let currentMinutes =
      startHour * 60 + startMinute;

    const endMinutes =
      endHour * 60 + endMinute;

    while (currentMinutes < endMinutes) {
      const hours = Math.floor(
        currentMinutes / 60,
      )
        .toString()
        .padStart(2, '0');

      const minutes = (currentMinutes % 60)
        .toString()
        .padStart(2, '0');

      slots.push(`${hours}:${minutes}`);

      currentMinutes += duration;
    }

    return slots;
  }

  async getSlots(
    doctorId: number,
    date: string,
  ) {
    const doctor =
      await this.doctorRepo.findOne({
        where: { id: doctorId },
      });

    if (!doctor) {
      throw new NotFoundException(
        'Doctor not found',
      );
    }

    if (!date) {
      throw new BadRequestException(
        'Date is required',
      );
    }

    const selectedDate = new Date(date);

    if (isNaN(selectedDate.getTime())) {
      throw new BadRequestException(
        'Invalid date',
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      throw new BadRequestException(
        'Past date not allowed',
      );
    }

    const override =
      await this.overrideRepo.findOne({
        where: {
          doctorId,
          date,
        },
      });

    let slots: string[] = [];

    if (override) {
      slots = this.generateSlots(
        override.startTime,
        override.endTime,
        15,
      );
    } else {
      const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      const day =
        dayNames[selectedDate.getDay()];

      const availabilities =
        await this.availabilityRepo.find({
          where: {
            doctorId,
            dayOfWeek: day,
          },
        });

      if (!availabilities.length) {
        throw new NotFoundException(
          'No availability found',
        );
      }

      for (const availability of availabilities) {
        const generatedSlots =
          this.generateSlots(
            availability.startTime,
            availability.endTime,
            15,
          );

        slots.push(...generatedSlots);
      }
    }

    const now = new Date();

    slots = slots.filter(slot => {
      const [hour, minute] = slot
        .split(':')
        .map(Number);

      const slotDate = new Date(date);

      slotDate.setHours(
        hour,
        minute,
        0,
        0,
      );

      return slotDate > now;
    });

    const bookedAppointments =
      await this.appointmentRepo.find({
        where: {
          doctorId,
          appointmentDate: date,
        },
      });

    slots = slots.filter(
      slot =>
        !bookedAppointments.some(
          appointment =>
            appointment.slotTime === slot,
        ),
    );

    return {
      doctorId,
      date,
      slots,
    };
  }
}