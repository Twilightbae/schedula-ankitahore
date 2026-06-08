import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Patient } from './patient.entity';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async createProfile(
    createPatientProfileDto: CreatePatientProfileDto,
  ) {
    const existingProfile =
      await this.patientRepository.findOne({
        where: {
          fullName:
            createPatientProfileDto.fullName,
        },
      });

    if (existingProfile) {
      throw new BadRequestException(
        'Patient profile already exists',
      );
    }

    const patient =
      this.patientRepository.create(
        createPatientProfileDto,
      );

    return await this.patientRepository.save(
      patient,
    );
  }

  async getProfile(id: number) {
    const patient =
      await this.patientRepository.findOne({
        where: { id },
      });

    if (!patient) {
      throw new NotFoundException(
        'Patient profile not found',
      );
    }

    return patient;
  }

  async updateProfile(
    id: number,
    updatePatientProfileDto: UpdatePatientProfileDto,
  ) {
    const patient =
      await this.patientRepository.findOne({
        where: { id },
      });

    if (!patient) {
      throw new NotFoundException(
        'Patient profile not found',
      );
    }

    Object.assign(
      patient,
      updatePatientProfileDto,
    );

    return await this.patientRepository.save(
      patient,
    );
  }
}