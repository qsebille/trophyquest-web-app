import {DOCUMENT} from '@angular/common';
import {TestBed} from '@angular/core/testing';
import {IdleReloadService} from './idle-reload.service';

describe('IdleReloadService', () => {
  const hour = 60 * 60 * 1000;
  let service: IdleReloadService;
  let page: Document;
  let view: EventTarget;
  let reload: ReturnType<typeof vi.fn>;
  let visibility: DocumentVisibilityState;

  beforeEach(() => {
    vi.useFakeTimers();
    page = document.implementation.createHTMLDocument();
    reload = vi.fn();
    view = Object.assign(new EventTarget(), {location: {reload}});
    visibility = 'visible';
    Object.defineProperties(page, {
      defaultView: {value: view},
      visibilityState: {get: () => visibility},
    });
    TestBed.configureTestingModule({providers: [{provide: DOCUMENT, useValue: page}]});
    service = TestBed.inject(IdleReloadService);
    service.start();
  });

  afterEach(() => {
    service.stop();
    vi.useRealTimers();
  });

  function setVisibility(state: DocumentVisibilityState): void {
    visibility = state;
    page.dispatchEvent(new Event('visibilitychange'));
  }

  it('keeps the page open after a short tab switch', () => {
    setVisibility('hidden');
    vi.advanceTimersByTime(hour - 1);
    setVisibility('visible');

    expect(reload).not.toHaveBeenCalled();
  });

  it('reloads exactly once when returning to a tab after an hour', () => {
    setVisibility('hidden');
    vi.advanceTimersByTime(hour);
    view.dispatchEvent(new Event('mousemove'));
    expect(reload).not.toHaveBeenCalled();

    setVisibility('visible');
    view.dispatchEvent(new Event('click'));
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('waits for activity on a visible page and measures inactivity from the last interaction', () => {
    vi.advanceTimersByTime(hour - 1);
    view.dispatchEvent(new Event('keydown'));
    vi.advanceTimersByTime(hour - 1);
    view.dispatchEvent(new Event('scroll'));
    expect(reload).not.toHaveBeenCalled();

    vi.advanceTimersByTime(hour);
    expect(reload).not.toHaveBeenCalled();
    view.dispatchEvent(new Event('click'));
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
