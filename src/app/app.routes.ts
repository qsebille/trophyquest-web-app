import {Routes} from '@angular/router';
import {HomePageComponent} from '@home/components/home-page/home-page.component';
import {GamePageComponent} from '@game/components/game-page/game-page.component';
import {GameSearchPageComponent} from '@game-search/components/game-search-page/game-search-page.component';
import {PlayerSearchPageComponent} from '@player-search/components/player-search-page/player-search-page.component';
import {AssociationPageComponent} from '@association/components/association-page/association-page.component';
import {AuthCallbackComponent} from '@core/auth/auth-callback/auth-callback.component';
import {authGuard} from '@core/auth/auth.guard';
import {adminGuard} from '@core/auth/admin.guard';

import {AccountPageComponent} from './features/account/components/account-page/account-page.component';
import {PlayerProfilePageComponent} from './features/player-profile/components/player-profile-page/player-profile-page.component';
import {SuitePageComponent} from './features/suite/components/suite-page/suite-page.component';

export const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: 'game/:gameId', component: GamePageComponent},
  {path: 'suite/:suiteId', component: SuitePageComponent},
  {path: 'game-search', component: GameSearchPageComponent},
  {path: 'player/:playerId', component: PlayerProfilePageComponent},
  {path: 'player-search', component: PlayerSearchPageComponent},
  {path: 'association', component: AssociationPageComponent, canActivate: [adminGuard]},
  {
    path: 'statistics',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/statistics/components/statistics-page/statistics-page.component')
      .then(module => module.StatisticsPageComponent),
  },
  {path: 'auth/callback', component: AuthCallbackComponent},
  {path: 'account', component: AccountPageComponent, canActivate: [authGuard]},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home'},
];
