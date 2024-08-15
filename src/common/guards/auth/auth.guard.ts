import { CanActivate, Injectable } from '@nestjs/common';
import { delay, Observable, of } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    return of(true).pipe(delay(0));
  }
}
