import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssociationHeaderComponent } from './association-header.component';

describe('AssociationHeaderComponent', () => {
  let component: AssociationHeaderComponent;
  let fixture: ComponentFixture<AssociationHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationHeaderComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AssociationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
