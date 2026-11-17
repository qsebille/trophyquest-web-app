import {Routes} from '@angular/router';
import {HomePageComponent} from '@home/home-page.component';
import {GamePageComponent} from '@game/game-page.component';
import {GameSearchPageComponent} from '@game-search/game-search-page.component';
import {PlayerSearchPageComponent} from '@player-search/player-search-page.component';
import {AssociationPageComponent} from '@association/association-page.component';

import {PlayerProfilePageComponent} from './pages/player-profile/player-profile-page.component';

export const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: 'game/:gameId', component: GamePageComponent},
  {path: 'game-search', component: GameSearchPageComponent},
  {path: 'player/:playerId', component: PlayerProfilePageComponent},
  {path: 'player-search', component: PlayerSearchPageComponent},
  {path: 'association', component: AssociationPageComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home'},
];
