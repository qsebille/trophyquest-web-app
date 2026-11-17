import {Service} from '@angular/core';
import {HttpParams, httpResource} from '@angular/common/http';
import {environment} from '@environment';
import {BackgroundImageResponse} from '@core/background/models/background-image-response.model';
import {Pagination} from '@core/models/pagination';
import {PlayerSummaryResponse} from '../models/player-summary-response';
import {PlayerSuiteItem} from '../models/player-suite-item';
import {PlayerTrophyItem} from '../models/player-trophy-item';

@Service()
export class PlayerProfileApiService {
  private readonly apiUrl = `${environment.apiUrl}/player/profile`;

  summary(playerId: () => string | null) {
    return httpResource<PlayerSummaryResponse>(() => playerId()
      ? {url: `${this.apiUrl}/${playerId()}`} : undefined);
  }

  background(playerId: () => string | null) {
    return httpResource<BackgroundImageResponse>(() => playerId()
      ? {url: `${this.apiUrl}/${playerId()}/background`} : undefined);
  }

  suites(playerId: () => string | null, page: () => number, size: () => number) {
    return this.list<PlayerSuiteItem>('suites', playerId, page, size);
  }

  trophies(playerId: () => string | null, page: () => number, size: () => number) {
    return this.list<PlayerTrophyItem>('trophies', playerId, page, size);
  }

  private list<T>(path: string, playerId: () => string | null,
                  page: () => number, size: () => number) {
    return httpResource<Pagination<T>>(() => playerId() ? {
      url: `${this.apiUrl}/${playerId()}/${path}`,
      params: new HttpParams().set('page', page()).set('size', size()),
    } : undefined);
  }
}
