import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Doctor } from './doctor.entity';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async createProfile(createDoctorProfileDto: CreateDoctorProfileDto) {
    const existingProfile = await this.doctorRepository.findOne({
      where: { fullName: createDoctorProfileDto.fullName },
    });

    if (existingProfile) {
      throw new BadRequestException(
        'Doctor profile already exists',
      );
    }

    const doctor = this.doctorRepository.create(
      createDoctorProfileDto,
    );

    return await this.doctorRepository.save(doctor);
  }

  async getProfile(id: number) {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException(
        'Doctor profile not found',
      );
    }

    return doctor;
  }

  async updateProfile(
    id: number,
    updateDoctorProfileDto: UpdateDoctorProfileDto,
  ) {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException(
        'Doctor profile not found',
      );
    }

    Object.assign(
      doctor,
      updateDoctorProfileDto,
    );

    return await this.doctorRepository.save(
      doctor,
    );
  }
}