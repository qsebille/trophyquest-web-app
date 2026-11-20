import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
  ViewContainerRef
} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {RouterLink} from '@angular/router';
import {AuthService} from '@core/auth/services/auth.service';
import {BackgroundService} from '@core/background/background.service';
import {SpinnerComponent} from '@core/spinner/spinner.component';
import {SuiteTrophyListComponent} from '../../ui/suite-trophy-list/suite-trophy-list.component';
import {PlayerCardComponent} from '@shared/player-card/player-card.component';
import {SuiteCardComponent} from '@shared/suite-card/suite-card.component';
import {TrophyCountComponent} from '@shared/trophy-count/trophy-count.component';
import {SuiteStoreService} from '../../api/suite-store.service';
import {SuiteTrophyFiltersComponent} from '../../ui/suite-trophy-filters/suite-trophy-filters.component';
import {EarnedTrophyFilterState} from '../../models/earned-trophy-filter-state';
import {
  SuiteEditModalComponent,
  SuiteEditModalData
} from '../suite-edit-modal/suite-edit-modal.component';

@Component({
  imports: [
    RouterLink, SpinnerComponent, SuiteCardComponent, PlayerCardComponent,
    SuiteTrophyFiltersComponent, SuiteTrophyListComponent, TrophyCountComponent, MatDialogModule,
  ],
  providers: [SuiteStoreService],
  templateUrl: './suite-page.component.html',
  styleUrl: './suite-page.component.scss',
})
export class SuitePageComponent {
  private readonly store = inject(SuiteStoreService);
  private readonly backgroundService = inject(BackgroundService);
  private readonly dialog = inject(MatDialog);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly titleDialog = signal<{ suiteId: string; ref: MatDialogRef<SuiteEditModalComponent> } | null>(null);
  readonly isAdmin = inject(AuthService).isAdmin;

  readonly suiteId = input<string | null>(null);
  readonly selectedTab = input('trophies', {
    alias: 'tab',
    transform: (value: string | undefined) => value === 'players' ? 'players' : 'trophies',
  });
  readonly playerId = input<string | null>(null);
  readonly playerPage = input(0, {
    transform: (value: string | undefined) => {
      const page = Number(value);
      return Number.isInteger(page) && page >= 0 && page <= 2147483647 ? page : 0;
    },
  });

  readonly suite = this.store.details;
  readonly game = this.store.game;
  readonly trophies = this.store.trophies;
  readonly players = this.store.players;
  readonly selectedPlayer = this.store.selectedPlayer;
  private readonly trophyFilterContext = computed(() => [this.suiteId(), this.selectedTab(), this.playerId()]);
  readonly showHiddenTrophies = linkedSignal({source: this.trophyFilterContext, computation: () => false});
  readonly earnedFilter = linkedSignal({
    source: this.trophyFilterContext,
    computation: (): EarnedTrophyFilterState => 'all',
  });

  readonly suiteNotFound = computed(() => {
    const error = this.suite.error();
    return error instanceof HttpErrorResponse && error.status === 404;
  });

  constructor() {
    effect(() => this.store.setContext({
      suiteId: this.suiteId(),
      selectedTab: this.selectedTab(),
      playerId: this.playerId(),
      playerPage: this.playerPage(),
    }));
    effect(() => {
      const background = this.store.background;
      this.backgroundService.setBackground(background.hasValue() ? background.value() : null);
    });
    effect(() => {
      const dialog = this.titleDialog();
      if (dialog && (dialog.suiteId !== this.suiteId() || !this.isAdmin())) {
        dialog.ref.close();
      }
    });
    inject(DestroyRef).onDestroy(() => this.titleDialog()?.ref.close());
  }

  editTitle(): void {
    const suiteId = this.suiteId();
    if (!suiteId || !this.isAdmin() || !this.suite.hasValue() || this.titleDialog()) {
      return;
    }
    const ref = this.dialog.open<SuiteEditModalComponent, SuiteEditModalData>(SuiteEditModalComponent, {
      data: {suiteId, title: this.suite.value().title},
      viewContainerRef: this.viewContainer,
      width: '34rem',
      maxWidth: 'calc(100vw - 2rem)',
      autoFocus: '#suite-title',
      ariaModal: true,
    });
    this.titleDialog.set({suiteId, ref});
    ref.afterClosed().subscribe(() => this.titleDialog.set(null));
  }
}
