import {httpResource} from '@angular/common/http';
import {Service} from '@angular/core';
import {environment} from '@environment';
import {PlayerSummaryResponse} from './dto/player-summary-response';

@Service()
export class PlayerSummaryApiService {
  summary(playerId: () => string | null) {
    return httpResource<PlayerSummaryResponse>(() => {
      const id = playerId();
      return id ? {url: `${environment.apiUrl}/player/profile/${id}`} : undefined;
    });
  }
}
