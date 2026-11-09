import {Service} from '@angular/core';
import {environment} from '@environment';
import {HttpParams, httpResource} from '@angular/common/http';
import {PlayerSearchItem} from '../models/player-search-item';
import {Pagination} from '@core/models/pagination';

@Service()
export class PlayerSearchApiService {
  private readonly apiUrl = `${environment.apiUrl}/player/search`;

  players(query: () => string,
          page: () => number,
          size: () => number) {
    return httpResource<Pagination<PlayerSearchItem>>(() => {
      let params = new HttpParams();
      params = params.set('page', page());
      params = params.set('size', size());
      params = params.set('query', query());
      return {
        url: this.apiUrl,
        params,
      }
    });
  }
}
