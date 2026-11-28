import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {catchError, filter, from, map, of, switchMap, take} from 'rxjs';
import {AuthService} from './services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const home = inject(Router).createUrlTree(['/home']);
  const token = authService.getAccessToken();
  const adminAccess = authService.adminAccess$.pipe(
    filter(isAdmin => isAdmin !== undefined),
    take(1),
    map(isAdmin => isAdmin || home),
  );

  return token instanceof Promise ? from(token).pipe(
    switchMap(value => value ? adminAccess : of(home)),
    catchError(() => of(home)),
  ) : token ? adminAccess : home;
};
