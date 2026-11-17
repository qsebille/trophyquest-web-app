import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {PlayerSuiteCardComponent} from './player-suite-card.component';
import {PlayerSuiteItem} from '../../models/player-suite-item';

const suite: PlayerSuiteItem = {
  suiteId: 'suite-1', gameId: 1001, title: 'Tomb Raider', platforms: ['PS5'], imageUrl: null,
  nbBronzeTrophies: 4, nbSilverTrophies: 3, nbGoldTrophies: 2, nbPlatinumTrophies: 1,
  nbEarnedBronzeTrophies: 2, nbEarnedSilverTrophies: 1,
  nbEarnedGoldTrophies: 1, nbEarnedPlatinumTrophies: 1, lastPlayedAt: null,
};

describe('PlayerSuiteCardComponent progression', () => {
  let fixture: ComponentFixture<PlayerSuiteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerSuiteCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(PlayerSuiteCardComponent);
  });

  it('fills the background using the proportion of earned trophies of all colors', () => {
    fixture.componentRef.setInput('suite', suite);
    fixture.detectChanges();
    const card: HTMLElement = fixture.nativeElement.querySelector('.suite-card');
    expect(card.style.getPropertyValue('--suite-progress')).toBe('50%');
    expect(card.classList.contains('suite-card-complete')).toBe(false);
    expect(fixture.nativeElement.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')).toBe('50');
    expect(fixture.nativeElement.textContent).toContain('5 / 10 trophies · 50%');
  });

  it('marks a suite complete only when every trophy has been obtained', () => {
    fixture.componentRef.setInput('suite', suite);
    fixture.detectChanges();
    // Owning the platinum alone does not mark the suite as complete.
    expect(fixture.componentInstance.isComplete()).toBe(false);
    fixture.componentRef.setInput('suite', {
      ...suite, nbEarnedBronzeTrophies: 4, nbEarnedSilverTrophies: 3, nbEarnedGoldTrophies: 2,
    });
    fixture.detectChanges();
    const card: HTMLElement = fixture.nativeElement.querySelector('.suite-card');
    expect(card.classList.contains('suite-card-complete')).toBe(true);
    expect(card.style.getPropertyValue('--suite-progress')).toBe('100%');
  });

  it('keeps an empty suite at zero without marking it complete', () => {
    fixture.componentRef.setInput('suite', {
      ...suite, nbBronzeTrophies: 0, nbSilverTrophies: 0, nbGoldTrophies: 0, nbPlatinumTrophies: 0,
      nbEarnedBronzeTrophies: 0, nbEarnedSilverTrophies: 0, nbEarnedGoldTrophies: 0, nbEarnedPlatinumTrophies: 0,
    });
    fixture.detectChanges();
    expect(fixture.componentInstance.completionPercent()).toBe(0);
    expect(fixture.componentInstance.isComplete()).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('0 / 0 trophies · 0%');
  });
});
