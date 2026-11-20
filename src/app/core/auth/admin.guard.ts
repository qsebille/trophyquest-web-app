import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {filter, map, take} from 'rxjs';
import {AuthService} from './services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const home = inject(Router).createUrlTree(['/home']);
  if (!authService.isAuthenticated()) {
    return home;
  }

  return authService.adminAccess$.pipe(
    filter(isAdmin => isAdmin !== undefined),
    take(1),
    map(isAdmin => isAdmin || home),
  );
};
