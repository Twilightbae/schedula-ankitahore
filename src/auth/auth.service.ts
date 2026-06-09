import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private users: any[] = [];

  async signup(signupDto: SignupDto) {
    const hashedPassword = await bcrypt.hash(
      signupDto.password,
      10,
    );

    const user = {
      id: Date.now(),
      name: signupDto.name,
      email: signupDto.email,
      password: hashedPassword,
      role: signupDto.role,
    };

    this.users.push(user);

    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const user = this.users.find(
      (u) => u.email === loginDto.email,
    );

    if (!user) {
      return {
        message: 'User not found',
      };
    }

    const isMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isMatch) {
      return {
        message: 'Invalid password',
      };
    }

    const payload = {
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      access_token: token,
      role: user.role,
    };
  }
}