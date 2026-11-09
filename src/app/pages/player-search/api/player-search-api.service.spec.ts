import { TestBed } from '@angular/core/testing';
import { PlayerSearchApiService } from './player-search-api.service';

describe('PlayerSearchApiService', () => {
  let service: PlayerSearchApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerSearchApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
