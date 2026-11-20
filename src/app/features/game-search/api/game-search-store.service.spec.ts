import { TestBed } from '@angular/core/testing';
import { GameSearchStoreService } from './game-search-store.service';

describe('GameSearchStoreService', () => {
  let service: GameSearchStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameSearchStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
