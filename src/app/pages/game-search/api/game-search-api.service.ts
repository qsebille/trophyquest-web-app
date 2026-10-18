import {Service} from '@angular/core';
import {environment} from '@environment';
import {HttpParams, httpResource} from '@angular/common/http';
import {BackgroundImageResponse} from '@core/background/models/background-image-response.model';
import {Pagination} from '@core/models/pagination';
import {GameSearchItem} from '@game-search/models/game-search-item.model';

@Service()
export class GameSearchApiService {
  private readonly apiUrl = `${environment.apiUrl}/game/search`;


  games(query: () => string | null,
        page: () => number,
        size: () => number) {
    return httpResource<Pagination<GameSearchItem>>(() => {
      let params = new HttpParams();
      params = params.set('page', page());
      params = params.set('size', size());
      if (query() !== null) {
        params = params.set('query', query() ?? '');
      }
      return {url: `${this.apiUrl}`, params};
    });
  }

  background() {
    return httpResource<BackgroundImageResponse>(() => {
      return {url: `${this.apiUrl}/background`};
    });
  }

}
