import {httpResource} from '@angular/common/http';
import {Service} from '@angular/core';
import {environment} from '@environment';
import {GameDetailsResponse} from './dto/game-details-response';

@Service()
export class GameDetailsApiService {
  details(gameId: () => string | null) {
    return httpResource<GameDetailsResponse>(() => {
      const id = gameId();
      return id ? {url: `${environment.apiUrl}/game/details/${id}`} : undefined;
    });
  }
}
