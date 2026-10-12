import {TestBed} from '@angular/core/testing';

import {HomeApi} from './home-api.service';

describe('HomeApiService', () => {
  let service: HomeApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
