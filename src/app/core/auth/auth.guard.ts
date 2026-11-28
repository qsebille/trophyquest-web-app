import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from './services/auth.service';

export const authGuard: CanActivateFn = () => {
  const home = inject(Router).createUrlTree(['/home']);
  const token = inject(AuthService).getAccessToken();
  return token instanceof Promise ? token.then(value => !!value || home, () => home) : !!token || home;
};
