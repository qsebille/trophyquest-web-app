import {DOCUMENT} from '@angular/common';
import {inject, NgZone, OnDestroy, Service} from '@angular/core';
import {filter, fromEvent, merge, Subscription} from 'rxjs';

@Service()
export class IdleReloadService implements OnDestroy {
  private readonly timeoutMs = 60 * 60 * 1000;
  private readonly document = inject(DOCUMENT);
  private readonly ngZone = inject(NgZone);
  private subscription?: Subscription;

  start(): void {
    this.stop();

    const view = this.document.defaultView;
    if (!view) return;

    let lastActivityAt = Date.now();
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    this.ngZone.runOutsideAngular(() => {
      this.subscription = merge(
        fromEvent(this.document, 'visibilitychange'),
        ...activityEvents.map(event => fromEvent(view, event, {passive: true})),
      ).pipe(
        filter(() => this.document.visibilityState === 'visible'),
      ).subscribe(() => {
        const now = Date.now();
        if (now - lastActivityAt >= this.timeoutMs) {
          this.stop();
          view.location.reload();
          return;
        }
        lastActivityAt = now;
      });
    });
  }

  stop(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
