import {Service} from '@angular/core';
import {environment} from '@environment';
import {HttpParams, httpResource} from '@angular/common/http';
import {BackgroundImageResponse} from '@core/background/models/background-image-response.model';
import {GameDetailsResponse} from '../models/game-details-response';
import {GameSuiteItem} from '../models/game-suite-item';
import {GamePlayerItem} from '../models/game-player-item';
import {GameTrophyItem} from '../models/game-trophy-item';
import {Pagination} from '@core/models/pagination';

@Service()
export class GameApiService {
  private readonly apiUrl = `${environment.apiUrl}/game-details`;


  details(gameId: () => string | null) {
    return httpResource<GameDetailsResponse>(() => {
      return gameId() ? {url: `${this.apiUrl}/${gameId()}`} : undefined;
    });
  }

  suites(gameId: () => string | null) {
    return httpResource<GameSuiteItem[]>(() => {
      return gameId() ? {url: `${this.apiUrl}/${gameId()}/suites`} : undefined;
    });
  }

  players(
    gameId: () => string | null,
    page: () => number,
  ) {
    const params = new HttpParams().set('page', page().toString());
    return httpResource<Pagination<GamePlayerItem>>(() => {
      return gameId() ? {url: `${this.apiUrl}/${gameId()}/players`, params} : undefined;
    });
  }

  trophies(
    suiteId: () => string | null,
    playerId: () => string | null,
  ) {
    return httpResource<GameTrophyItem[]>(() => {
      let params = new HttpParams();
      if (playerId()) {
        params = params.set('playerId', playerId() ?? '');
      }
      return suiteId() ? {url: `${this.apiUrl}/suite/${suiteId()}/trophies`, params} : undefined;
    });
  }

  background(gameId: () => string | null) {
    return httpResource<BackgroundImageResponse>(() => {
      return gameId() ? {url: `${this.apiUrl}/${gameId()}/background`} : undefined;
    });
  }
}
