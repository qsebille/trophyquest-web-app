import {Routes} from '@angular/router';
import {HomePageComponent} from '@home/home-page.component';
import {GamePageComponent} from '@game/game-page.component';

export const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: 'game/:gameId', component: GamePageComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home'},
];
