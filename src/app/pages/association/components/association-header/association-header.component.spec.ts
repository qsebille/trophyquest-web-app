import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AssociationHeaderComponent} from './association-header.component';
import {AssociationItem} from '@association/models/association-item';
import {Pagination} from '@core/models/pagination';

describe('AssociationHeaderComponent', () => {
  let component: AssociationHeaderComponent;
  let fixture: ComponentFixture<AssociationHeaderComponent>;

  const associationPaginationStub = {
    content: [],
    total: 10,
    page: 1,
    size: 1
  } as Pagination<AssociationItem>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationHeaderComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AssociationHeaderComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('associationPagination', associationPaginationStub)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
