import {inject, Service} from '@angular/core';
import {HttpParams, httpResource} from '@angular/common/http';
import {environment} from '@environment';
import {BackgroundImageResponse} from '@core/background/models/background-image-response.model';
import {Pagination} from '@core/models/pagination';
import {PlayerSummaryApiService} from '@shared/api/player-summary-api.service';
import {PlayerSuiteItem} from './dto/player-suite-item';
import {PlayerTrophyItem} from './dto/player-trophy-item';

@Service()
export class PlayerProfileApiService {
  private readonly apiUrl = `${environment.apiUrl}/player/profile`;
  private readonly playerSummaryApi = inject(PlayerSummaryApiService);

  summary(playerId: () => string | null) {
    return this.playerSummaryApi.summary(playerId);
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
