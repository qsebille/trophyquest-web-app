import { TestBed } from '@angular/core/testing';
import { GameSearchApiService } from './game-search-api.service';

describe('GameSearchApiService', () => {
  let service: GameSearchApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameSearchApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
