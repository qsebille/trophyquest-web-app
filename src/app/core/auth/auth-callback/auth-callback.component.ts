import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Navigator} from '../../routing/navigator.service';

@Component({
  selector: 'tq-auth-callback',
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss',
})
export class AuthCallbackComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _authService = inject(AuthService);
  private readonly _navigator = inject(Navigator);

  async ngOnInit(): Promise<void> {
    const code = this._route.snapshot.queryParamMap.get('code');
    const state = this._route.snapshot.queryParamMap.get('state');

    try {
      await this._authService.handleCallback(code, state);
      this._authService.refreshCurrentUser();
      this._navigator.goToHomePage();
    } catch {
      this._navigator.goToErrorPage();
    }
  }
}
