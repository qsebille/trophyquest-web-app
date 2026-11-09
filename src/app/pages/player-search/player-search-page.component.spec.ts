import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PlayerSearchPageComponent} from './player-search-page.component';

describe('PlayerSearchPageComponent', () => {
  let component: PlayerSearchPageComponent;
  let fixture: ComponentFixture<PlayerSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerSearchPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PlayerSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
