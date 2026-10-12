import {inject, Injectable} from '@angular/core';
import {environment} from '@environment';
import {HttpClient} from '@angular/common/http';
import {HomeGameItem} from '@home/models/home-game-item';
import {HomePlayerItem} from '@home/models/home-player-item';

@Injectable({
  providedIn: 'root',
})
export class HomeApi {
  private readonly apiUrl = `${environment.apiUrl}/home`;
  private readonly http = inject(HttpClient);

  fetchTopGames(size: number) {
    return this.http.get<HomeGameItem[]>(`${this.apiUrl}/top-games?size=${size}`);
  }

  fetchTopPlayers(size: number) {
    return this.http.get<HomePlayerItem[]>(`${this.apiUrl}/top-players?size=${size}`);
  }

}
