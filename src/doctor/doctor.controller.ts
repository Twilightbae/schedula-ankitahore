import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';

@Controller('doctor')
@UseGuards(RolesGuard)
export class DoctorController {
  @Get('profile')
  getProfile() {
    return {
      message: 'Doctor Profile',
    };
  }
}