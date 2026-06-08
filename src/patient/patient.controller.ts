import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(RolesGuard)
@Controller('patient')
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
  ) {}

  @Post('profile')
  createProfile(
    @Body() createPatientProfileDto: CreatePatientProfileDto,
  ) {
    return this.patientService.createProfile(
      createPatientProfileDto,
    );
  }

  @Get('profile/:id')
  getProfile(@Param('id') id: string) {
    return this.patientService.getProfile(
      Number(id),
    );
  }

  @Patch('profile/:id')
  updateProfile(
    @Param('id') id: string,
    @Body()
    updatePatientProfileDto: UpdatePatientProfileDto,
  ) {
    return this.patientService.updateProfile(
      Number(id),
      updatePatientProfileDto,
    );
  }
}