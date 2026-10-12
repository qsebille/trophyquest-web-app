import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environment';
import {Observable} from 'rxjs';
import {AuthUser} from '../models/auth-user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly httpClient = inject(HttpClient);

  fetchCurrentUser(): Observable<AuthUser> {
    return this.httpClient.get<AuthUser>(`${this.apiUrl}/me`);
  }
}
