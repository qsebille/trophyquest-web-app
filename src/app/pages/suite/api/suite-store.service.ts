import {computed, inject, Injectable, signal} from '@angular/core';
import {GameApiService} from '@game/api/game-api.service';
import {firstValueFrom} from 'rxjs';
import {PlayerProfileApiService} from '../../player-profile/api/player-profile-api.service';
import {SuiteApiService} from './suite-api.service';

interface SuitePageContext {
  suiteId: string | null;
  selectedTab: 'trophies' | 'players';
  playerId: string | null;
  playerPage: number;
}

@Injectable()
export class SuiteStoreService {
  private readonly api = inject(SuiteApiService);
  private readonly context = signal<SuitePageContext>({
    suiteId: null,
    selectedTab: 'trophies',
    playerId: null,
    playerPage: 0,
  });
  private readonly suiteId = computed(() => this.context().suiteId);
  private readonly playerId = computed(() => this.context().playerId);
  private readonly playerPage = computed(() => this.context().playerPage);

  private readonly trophySuiteId = computed(() => this.suiteIdFor('trophies'));
  private readonly playerSuiteId = computed(() => this.suiteIdFor('players'));

  readonly details = this.api.details(this.suiteId);
  readonly background = this.api.background(this.suiteId);
  readonly trophies = this.api.trophies(this.trophySuiteId, this.playerId);
  readonly players = this.api.players(this.playerSuiteId, this.playerPage);
  readonly game = inject(GameApiService).details(() => {
    const gameId = this.details.hasValue() ? this.details.value().gameId : null;
    return gameId == null ? null : String(gameId);
  });
  readonly selectedPlayer = inject(PlayerProfileApiService).summary(() =>
    this.trophySuiteId() ? this.playerId() : null);

  setContext(context: SuitePageContext): void {
    this.context.set(context);
  }

  async updateTitle(suiteId: string, title: string): Promise<void> {
    const details = await firstValueFrom(this.api.updateTitle(suiteId, title));
    if (this.suiteId() === suiteId) {
      this.details.set(details);
    }
  }

  private suiteIdFor(tab: SuitePageContext['selectedTab']): string | null {
    return this.context().selectedTab === tab && this.details.hasValue() ? this.details.value().suiteId : null;
  }
}
