import {inject, Service, signal} from '@angular/core';
import {GameApiService} from './game-api.service';

@Service()
export class GameStoreService {
  private readonly api = inject(GameApiService);

  private readonly gameId = signal<string | null>(null);
  private readonly suiteId = signal<string | null>(null);
  private readonly playerId = signal<string | null>(null);
  private readonly playerPage = signal<number>(0);

  readonly details = this.api.details(this.gameId);
  readonly background = this.api.background(this.gameId);
  readonly suites = this.api.suites(this.gameId);
  readonly players = this.api.players(this.gameId, this.playerPage);
  readonly trophies = this.api.trophies(this.suiteId, this.playerId);

  setGameId(gameId: string | null): void {
    this.gameId.set(gameId);
  }

  setPlayerPage(page: number): void {
    this.playerPage.set(page);
  }

  setSuiteId(suiteId: string | null): void {
    this.suiteId.set(suiteId);
  }

  setPlayerId(playerId: string | null): void {
    this.playerId.set(playerId);
  }
}
