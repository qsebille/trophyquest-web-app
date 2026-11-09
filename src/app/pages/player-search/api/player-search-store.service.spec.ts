import { TestBed } from '@angular/core/testing';
import { PlayerSearchStoreService } from './player-search-store.service';

describe('PlayerSearchStoreService', () => {
  let service: PlayerSearchStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerSearchStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
