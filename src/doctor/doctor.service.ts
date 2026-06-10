import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

  async createProfile(
    createDoctorProfileDto: CreateDoctorProfileDto,
  ) {
    const existingProfile =
      await this.doctorRepository.findOne({
        where: {
          fullName:
            createDoctorProfileDto.fullName,
        },
      });

    if (existingProfile) {
      throw new BadRequestException(
        'Doctor profile already exists',
      );
    }

    const doctor =
      this.doctorRepository.create(
        createDoctorProfileDto,
      );

    return await this.doctorRepository.save(
      doctor,
    );
  }

  async getDoctors(
    specialization?: string,
    search?: string,
    page = 1,
    limit = 10,
    availability?: string,
  ) {
    if (page < 1 || limit < 1) {
      throw new BadRequestException(
        'Page and limit must be positive numbers',
      );
    }

    const query =
      this.doctorRepository.createQueryBuilder(
        'doctor',
      );

    if (specialization) {
      query.andWhere(
        'LOWER(doctor.specialization) = LOWER(:specialization)',
        { specialization },
      );
    }

    if (search) {
      query.andWhere(
        'LOWER(doctor.fullName) LIKE LOWER(:search)',
        {
          search: `%${search}%`,
        },
      );
    }

    if (availability) {
      query.andWhere(
        'LOWER(doctor.availability) = LOWER(:availability)',
        { availability },
      );
    }

    query.skip((page - 1) * limit);

    query.take(limit);

    const doctors =
      await query.getMany();

    if (!doctors.length) {
      throw new NotFoundException(
        'No doctors found',
      );
    }

    return doctors;
  }

  async getProfile(id: number) {
    const doctor =
      await this.doctorRepository.findOne({
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
    const doctor =
      await this.doctorRepository.findOne({
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