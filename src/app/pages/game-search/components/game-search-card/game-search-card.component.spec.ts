import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameSearchCardComponent } from './game-search-card.component';

describe('GameSearchCardComponent', () => {
  let component: GameSearchCardComponent;
  let fixture: ComponentFixture<GameSearchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSearchCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GameSearchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
