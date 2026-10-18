import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrophyCountComponent } from './trophy-count.component';

describe('TrophyCountComponent', () => {
  let component: TrophyCountComponent;
  let fixture: ComponentFixture<TrophyCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrophyCountComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TrophyCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
