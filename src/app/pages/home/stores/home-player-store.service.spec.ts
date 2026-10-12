import {TestBed} from '@angular/core/testing';

import {HomePlayerStore} from './home-player-store.service';

describe('HomePlayerStore', () => {
  let service: HomePlayerStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HomePlayerStore]
    });
    service = TestBed.inject(HomePlayerStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
