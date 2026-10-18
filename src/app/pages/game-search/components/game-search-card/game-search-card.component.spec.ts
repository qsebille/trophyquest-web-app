import {ComponentFixture, TestBed} from '@angular/core/testing';
import {GameSearchCardComponent} from './game-search-card.component';
import {GameSearchItem} from '@game-search/models/game-search-item.model';

describe('GameSearchCardComponent', () => {
  let component: GameSearchCardComponent;
  let fixture: ComponentFixture<GameSearchCardComponent>;

  let gameStub = {
    gameId: 'game-001',
    title: 'Astro Bot',
    coverUrl: 'astro-bot.jpg'
  } as GameSearchItem

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSearchCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GameSearchCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('game', gameStub);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
