import {inject, Service, signal} from '@angular/core';
import {GameApiService} from './game-api.service';

@Service()
export class GameStoreService {
  private readonly api = inject(GameApiService);
  private readonly gameId = signal<string | null>(null);

  readonly details = this.api.details(this.gameId);
  readonly background = this.api.background(this.gameId);
  readonly suites = this.api.suites(this.gameId);
  readonly players = this.api.players(this.gameId, 10);

  setGameId(gameId: string | null): void {
    this.gameId.set(gameId);
  }
}
