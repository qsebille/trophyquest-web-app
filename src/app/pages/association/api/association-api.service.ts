import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams, httpResource} from '@angular/common/http';
import {AssociationItem} from '../models/association-item';
import {environment} from '@environment';
import {Pagination} from '@core/models/pagination';

@Injectable({
  providedIn: 'root',
})
export class AssociationApiService {
  private readonly apiUrl = `${environment.apiUrl}/association`;
  private readonly http: HttpClient = inject(HttpClient);

  associations(page: () => number) {
    return httpResource<Pagination<AssociationItem>>(() => {
      let params = new HttpParams();
      params = params.set('page', page());
      return {url: this.apiUrl, params};
    })
  }

  validateAssociation(suiteId: string, gameId: number) {
    return this.http.post<boolean>(`${this.apiUrl}/validate`, {suiteId, gameId});
  }

  rejectAllCandidates(suiteId: string) {
    return this.http.post<boolean>(`${this.apiUrl}/reject`, {suiteId});
  }
}
