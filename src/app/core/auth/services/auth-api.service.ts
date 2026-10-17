import {inject, Service} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environment';
import {Observable} from 'rxjs';
import {AuthUser} from '../models/auth-user.model';

@Service()
export class AuthApiService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly httpClient = inject(HttpClient);

  fetchCurrentUser(): Observable<AuthUser> {
    return this.httpClient.get<AuthUser>(`${this.apiUrl}/me`);
  }
}
