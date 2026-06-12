import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Appointment } from './appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  async create(data: Partial<Appointment>) {
    const appointment =
      this.appointmentRepo.create(data);

    return this.appointmentRepo.save(
      appointment,
    );
  }

  async findAll() {
    return this.appointmentRepo.find();
  }
}