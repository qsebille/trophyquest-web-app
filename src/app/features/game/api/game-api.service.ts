import {inject, Service} from '@angular/core';
import {environment} from '@environment';
import {httpResource} from '@angular/common/http';
import {BackgroundImageResponse} from '@core/background/models/background-image-response.model';
import {GameDetailsApiService} from '@shared/api/game-details-api.service';
import {SuiteItem} from '@shared/models/suite-item';
import {PlayerItem} from '@shared/models/player-item';

@Service()
export class GameApiService {
  private readonly apiUrl = `${environment.apiUrl}/game/details`;
  private readonly gameDetailsApi = inject(GameDetailsApiService);

  details(gameId: () => string | null) {
    return this.gameDetailsApi.details(gameId);
  }

  suites(gameId: () => string | null) {
    return httpResource<SuiteItem[]>(() => {
      return gameId() ? {url: `${this.apiUrl}/${gameId()}/suites`} : undefined;
    });
  }

  players(gameId: () => string | null, size: number) {
    return httpResource<PlayerItem[]>(() => gameId() ? {
      url: `${this.apiUrl}/${gameId()}/players`,
      params: {size},
    } : undefined);
  }

  background(gameId: () => string | null) {
    return httpResource<BackgroundImageResponse>(() => {
      return gameId() ? {url: `${this.apiUrl}/${gameId()}/background`} : undefined;
    });
  }
}
