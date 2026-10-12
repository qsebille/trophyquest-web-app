import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HomePlayerList} from './home-player-list.component';

describe('HomePlayerListComponent', () => {
  let component: HomePlayerList;
  let fixture: ComponentFixture<HomePlayerList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePlayerList]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePlayerList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
});
