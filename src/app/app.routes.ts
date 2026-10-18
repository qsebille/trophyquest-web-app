import {Routes} from '@angular/router';
import {HomePageComponent} from '@home/home-page.component';
import {GamePageComponent} from '@game/game-page.component';
import {GameSearchPageComponent} from '@game-search/game-search-page.component';

export const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: 'game/:gameId', component: GamePageComponent},
  {path: 'game-search', component: GameSearchPageComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home'},
];
