import {computed, inject, Service, signal} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {toObservable} from '@angular/core/rxjs-interop';
import {firstValueFrom} from 'rxjs';
import {NotificationService} from '@core/notification/notification.service';
import {environment} from '@environment';
import {AuthState} from '../models/auth-state';
import {TokenResponse} from '../models/token-response';
import {AuthApiService} from './auth-api.service';


@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authApiService = inject(AuthApiService);
  private readonly notifications = inject(NotificationService);

  private readonly domain = environment.cognito.domain;
  private readonly clientId = environment.cognito.clientId;
  private readonly scope = environment.cognito.scope;
  private readonly refreshWindowMs = 30_000;
  private renewal?: {session: AuthState; token: Promise<string | null>};
  private readonly sessionVersion = signal(0);

  readonly authState = signal<AuthState | null>(this.restoreAuthState());

  readonly isAuthenticated = computed(() => this.authState() !== null);
  private readonly profile = this.authApiService.fetchCurrentUser(
    () => this.isAuthenticated() ? this.sessionVersion() : null,
  );
  readonly currentUser = computed(() => this.profile.hasValue() ? this.profile.value() : null);
  readonly profileLoadFailed = computed(() => this.profile.status() === 'error');
  readonly isAdmin = computed(() => this.isAuthenticated() && this.currentUser()?.isAdmin === true);
  readonly adminAccess$ = toObservable(computed(() =>
    this.isAuthenticated() && this.profile.isLoading() ? undefined : this.isAdmin(),
  ));

  getAccessToken(): string | null | Promise<string | null> {
    const session = this.authState();
    if (!session) return null;

    const remainingMs = session.expiresAt - Date.now();
    if (remainingMs > this.refreshWindowMs || (remainingMs > 0 && !session.refreshToken)) {
      return session.accessToken;
    }
    if (!session.refreshToken) {
      this.expireSession();
      return null;
    }

    if (this.renewal?.session === session) return this.renewal.token;

    const token = this.renewAccessToken(session, session.refreshToken).finally(() => {
      if (this.renewal?.token === token) this.renewal = undefined;
    });
    this.renewal = {session, token};
    return token;
  }

  async register(): Promise<void> {
    await this.redirectToCognito('/signup');
  }

  async login(): Promise<void> {
    await this.redirectToCognito('/login');
  }

  async handleCallback(code: string | null, state: string | null): Promise<void> {
    if (!code) {
      throw new Error('Missing authorization code');
    }

    const expectedState = sessionStorage.getItem('oauth_state');
    if (!state || state !== expectedState) {
      throw new Error('Invalid OAuth state');
    }

    const codeVerifier = sessionStorage.getItem('pkce_code_verifier');
    if (!codeVerifier) {
      throw new Error('Missing PKCE code verifier');
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.clientId,
      code,
      redirect_uri: this.redirectUri,
      code_verifier: codeVerifier,
    });

    const tokens = await this.requestTokens(body);
    this.saveTokens(tokens);
    this.sessionVersion.update(version => version + 1);

    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('pkce_code_verifier');
  }

  logout(): void {
    this.clearSession();
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('pkce_code_verifier');

    const logoutUrl = new URL(`${this.domain}/logout`);
    logoutUrl.searchParams.set('client_id', this.clientId);
    logoutUrl.searchParams.set('logout_uri', window.location.origin);

    window.location.assign(logoutUrl.toString());
  }

  refreshCurrentUser(): void {
    this.profile.reload();
  }

  async updateDisplayName(displayName: string): Promise<void> {
    const version = this.sessionVersion();
    const user = await firstValueFrom(this.authApiService.updateDisplayName(displayName));
    if (this.authState() && this.sessionVersion() === version) {
      this.profile.set(user);
    }
  }

  private async renewAccessToken(session: AuthState, refreshToken: string): Promise<string | null> {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: this.clientId,
      refresh_token: refreshToken,
    });

    try {
      const tokens = await this.requestTokens(body);
      if (this.authState() !== session) return null;

      this.saveTokens(tokens, refreshToken);
      return tokens.access_token;
    } catch (error) {
      if (this.authState() !== session) return null;
      if (error instanceof HttpErrorResponse && error.status === 400
        && error.error?.error === 'invalid_grant') {
        this.expireSession();
        return null;
      }
      if (session.expiresAt > Date.now()) return session.accessToken;
      throw error;
    }
  }

  private requestTokens(body: URLSearchParams): Promise<TokenResponse> {
    return firstValueFrom(this.http.post<TokenResponse>(
      `${this.domain}/oauth2/token`,
      body.toString(),
      {headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})},
    ));
  }

  private saveTokens(tokens: TokenResponse, previousRefreshToken?: string): void {
    const session: AuthState = {
      accessToken: tokens.access_token,
      idToken: tokens.id_token,
      refreshToken: tokens.refresh_token ?? previousRefreshToken,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    };
    this.authState.set(session);
    sessionStorage.setItem('auth_state', JSON.stringify(session));
  }

  private clearSession(): void {
    this.authState.set(null);
    this.sessionVersion.update(version => version + 1);
    sessionStorage.removeItem('auth_state');
  }

  private expireSession(): void {
    this.clearSession();
    this.notifications.sendInfo('Your session expired. Sign in again to continue.');
  }

  private get redirectUri(): string {
    return `${window.location.origin}/auth/callback`;
  }

  private async redirectToCognito(path: '/login' | '/signup'): Promise<void> {
    const state = crypto.randomUUID();
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('pkce_code_verifier', codeVerifier);

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      scope: this.scope,
      redirect_uri: this.redirectUri,
      state,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    });

    window.location.assign(`${this.domain}${path}?${params.toString()}`);
  }

  private generateCodeVerifier(length = 64): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const bytes = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(bytes, b => chars[b % chars.length]).join('');
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const data = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(new Uint8Array(digest));
  }

  private base64UrlEncode(bytes: Uint8Array): string {
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private restoreAuthState(): AuthState | null {
    const raw = sessionStorage.getItem('auth_state');
    if (!raw) {
      return null;
    }

    try {
      const state = JSON.parse(raw) as AuthState;
      return state && (state.expiresAt > Date.now() || state.refreshToken) ? state : null;
    } catch {
      return null;
    }
  }
}
