import {inject, Service} from '@angular/core';
import {HttpClient, httpResource} from '@angular/common/http';
import {BackgroundImageResponse} from '@core/background/models/background-image-response.model';
import {Pagination} from '@core/models/pagination';
import {environment} from '@environment';
import {PlayerItem} from '@shared/models/player-item';
import {TrophyItem} from '@shared/models/trophy-item';
import {SuiteDetails} from './dto/suite-details';


@Service()
export class SuiteApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/suite`;

  details(suiteId: () => string | null) {
    return httpResource<SuiteDetails>(() => {
      const id = suiteId();
      return id ? `${this.url}/${encodeURIComponent(id)}` : undefined;
    });
  }

  updateTitle(suiteId: string, title: string) {
    return this.http.put<SuiteDetails>(`${this.url}/${encodeURIComponent(suiteId)}/title`, {title});
  }

  background(suiteId: () => string | null) {
    return httpResource<BackgroundImageResponse>(() => {
      const id = suiteId();
      return id ? `${this.url}/${encodeURIComponent(id)}/background` : undefined;
    });
  }

  trophies(suiteId: () => string | null, playerId: () => string | null) {
    return httpResource<TrophyItem[]>(() => {
      const id = suiteId();
      const player = playerId();
      return id ? {
        url: `${this.url}/${encodeURIComponent(id)}/trophies`,
        params: player ? {playerId: player} : undefined,
      } : undefined;
    });
  }

  players(suiteId: () => string | null, page: () => number) {
    return httpResource<Pagination<PlayerItem>>(() => {
      const id = suiteId();
      return id ? {
        url: `${this.url}/${encodeURIComponent(id)}/players`,
        params: {page: page(), size: 10},
      } : undefined;
    });
  }
}
