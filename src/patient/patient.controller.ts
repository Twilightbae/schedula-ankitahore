import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';

@Controller('patient')
@UseGuards(RolesGuard)
export class PatientController {
  @Get('profile')
  getProfile() {
    return {
      message: 'Patient Profile',
    };
  }
}