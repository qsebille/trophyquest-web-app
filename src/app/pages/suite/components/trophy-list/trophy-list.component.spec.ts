import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TrophyListComponent} from './trophy-list.component';

describe('TrophyListComponent', () => {
  let component: TrophyListComponent;
  let fixture: ComponentFixture<TrophyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrophyListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TrophyListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('trophies', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
