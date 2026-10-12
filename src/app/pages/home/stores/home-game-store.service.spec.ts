import {TestBed} from '@angular/core/testing';

import {HomeGameStore} from './home-game-store.service';

describe('HomeGameStore', () => {
  let service: HomeGameStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HomeGameStore
      ]
    });
    service = TestBed.inject(HomeGameStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
