import {inject, Service} from '@angular/core';
import {HttpClient, httpResource} from '@angular/common/http';
import {environment} from '@environment';
import {Observable} from 'rxjs';
import {AuthUser} from '../models/auth-user.model';

@Service()
export class AuthApiService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly httpClient = inject(HttpClient);

  fetchCurrentUser(accessToken: () => string | undefined) {
    return httpResource<AuthUser>(() => accessToken() ? {url: `${this.apiUrl}/me`} : undefined);
  }

  updateDisplayName(displayName: string): Observable<AuthUser> {
    return this.httpClient.put<AuthUser>(`${this.apiUrl}/me`, {displayName});
  }
}
