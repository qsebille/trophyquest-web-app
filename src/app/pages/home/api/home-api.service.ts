import {Service} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {environment} from '@environment';
import {HomeGameItem} from '@home/api/models/home-game-item';
import {HomePlayerItem} from '@home/api/models/home-player-item';
import {BackgroundImageResponse} from '@core/background/models/background-image-response.model';

@Service()
export class HomeApiService {
  private readonly apiUrl = `${environment.apiUrl}/home`;

  background() {
    return httpResource<BackgroundImageResponse>(() => ({
      url: `${this.apiUrl}/background`,
    }));
  }

  topGames(size: () => number) {
    return httpResource<HomeGameItem[]>(() => ({
      url: `${this.apiUrl}/top-games`,
      params: {size: size()},
    }), {defaultValue: []});
  }

  topPlayers(size: () => number) {
    return httpResource<HomePlayerItem[]>(() => ({
      url: `${this.apiUrl}/top-players`,
      params: {size: size()},
    }), {defaultValue: []});
  }
}
