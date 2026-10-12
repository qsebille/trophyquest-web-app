import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeGameList} from './home-game-list.component';

describe('HomeGameListComponent', () => {
  let component: HomeGameList;
  let fixture: ComponentFixture<HomeGameList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeGameList]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeGameList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
