import {Routes} from '@angular/router';
import {HomePageComponent} from '@home/home-page.component';
import {GamePageComponent} from '@game/game-page.component';
import {GameSearchPageComponent} from '@game-search/game-search-page.component';
import {PlayerSearchPageComponent} from '@player-search/player-search-page.component';
import {AssociationPageComponent} from '@association/association-page.component';
import {AuthCallbackComponent} from '@core/auth/auth-callback/auth-callback.component';
import {authGuard} from '@core/auth/auth.guard';

import {AccountPageComponent} from './pages/account/account-page.component';
import {PlayerProfilePageComponent} from './pages/player-profile/player-profile-page.component';
import {SuitePageComponent} from './pages/suite/suite-page.component';

export const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: 'game/:gameId', component: GamePageComponent},
  {path: 'suite/:suiteId', component: SuitePageComponent},
  {path: 'game-search', component: GameSearchPageComponent},
  {path: 'player/:playerId', component: PlayerProfilePageComponent},
  {path: 'player-search', component: PlayerSearchPageComponent},
  {path: 'association', component: AssociationPageComponent},
  {path: 'auth/callback', component: AuthCallbackComponent},
  {path: 'account', component: AccountPageComponent, canActivate: [authGuard]},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home'},
];
