import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const role = request.headers.role;

    if (!role) {
      throw new ForbiddenException('Role not provided');
    }

    const path = request.route.path;

    if (path.includes('doctor') && role !== 'doctor') {
      throw new ForbiddenException('Doctor access only');
    }

    if (path.includes('patient') && role !== 'patient') {
      throw new ForbiddenException('Patient access only');
    }

    return true;
  }
}