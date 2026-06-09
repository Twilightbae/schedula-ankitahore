import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import { DoctorService } from './doctor.service';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(RolesGuard)
@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
  ) {}

  @Post('profile')
  createProfile(
    @Body()
    createDoctorProfileDto: CreateDoctorProfileDto,
  ) {
    return this.doctorService.createProfile(
      createDoctorProfileDto,
    );
  }

  @Get()
  getDoctors(
    @Query('specialization')
    specialization?: string,

    @Query('search')
    search?: string,

    @Query('page')
    page?: string,

    @Query('limit')
    limit?: string,

    @Query('availability')
    availability?: string,
  ) {
    return this.doctorService.getDoctors(
      specialization,
      search,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      availability,
    );
  }

  @Get('profile/:id')
  getProfile(
    @Param('id') id: string,
  ) {
    return this.doctorService.getProfile(
      Number(id),
    );
  }

  @Patch('profile/:id')
  updateProfile(
    @Param('id') id: string,

    @Body()
    updateDoctorProfileDto: UpdateDoctorProfileDto,
  ) {
    return this.doctorService.updateProfile(
      Number(id),
      updateDoctorProfileDto,
    );
  }
}