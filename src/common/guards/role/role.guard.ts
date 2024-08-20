import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthorizationService } from 'src/common/authorization';

/**
 * role角色守卫
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly authorizationService: AuthorizationService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    (request as any).user = { role: 'manager' };
    const { user, path, method } = request as any;
    const action = this.authorizationService.mappingAction(method);

    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authorizationService.checkPermission(
      `role:${user.role}`,
      path,
      action,
    );
  }
}
