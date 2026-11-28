import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {environment} from '@environment';
import {from, switchMap} from 'rxjs';
import {AuthService} from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url !== environment.apiUrl && !req.url.startsWith(`${environment.apiUrl}/`)) {
    return next(req);
  }

  const token = inject(AuthService).getAccessToken();
  const send = (accessToken: string | null) => next(accessToken ? req.clone({
    setHeaders: {Authorization: `Bearer ${accessToken}`},
  }) : req);

  return token instanceof Promise ? from(token).pipe(switchMap(send)) : send(token);
};
