import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SuiteTrophyListComponent} from './suite-trophy-list.component';

describe('SuiteTrophyListComponent', () => {
  let component: SuiteTrophyListComponent;
  let fixture: ComponentFixture<SuiteTrophyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiteTrophyListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SuiteTrophyListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('trophies', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
