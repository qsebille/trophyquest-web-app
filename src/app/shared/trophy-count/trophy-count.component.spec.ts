import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TrophyCountComponent} from './trophy-count.component';

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
    fixture.componentRef.setInput('platinumCount', 0);
    fixture.componentRef.setInput('goldCount', 1);
    fixture.componentRef.setInput('silverCount', 2);
    fixture.componentRef.setInput('bronzeCount', 3);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
