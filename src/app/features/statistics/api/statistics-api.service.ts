import {httpResource} from '@angular/common/http';
import {Service} from '@angular/core';
import {environment} from '@environment';
import {StatisticsResponse} from './dto/statistics-response';

@Service()
export class StatisticsApiService {
  current() {
    return httpResource<StatisticsResponse>(() => `${environment.apiUrl}/statistics`);
  }
}
