import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const role: string | undefined = req.user?.role;
    if (role !== 'ADMIN') {
      throw new ForbiddenException('Admin role required');
    }
    return true;
  }
}


