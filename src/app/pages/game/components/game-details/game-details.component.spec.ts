import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GameDetailsComponent} from './game-details.component';
import {GameDetailsResponse} from '@game/models/game-details-response';

describe('GameDetailsComponent', () => {
  let component: GameDetailsComponent;
  let fixture: ComponentFixture<GameDetailsComponent>;

  let gameDetailsMock = {
    gameId: 'game-123',
    title: 'Game 123',
    summary: '',
    genres: [],
    themes: [],
    coverUrl: 'game-123.png',
    screenshotsUrl: []
  } as unknown as GameDetailsResponse;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameDetailsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GameDetailsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('gameDetails', gameDetailsMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
