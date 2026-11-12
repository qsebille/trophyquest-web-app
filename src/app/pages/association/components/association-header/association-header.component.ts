import {Component, input, output} from '@angular/core';
import {Pagination} from '@core/models/pagination';
import {AssociationItem} from '@association/models/association-item';

@Component({
  imports: [],
  selector: 'tq-association-header',
  styleUrl: './association-header.component.scss',
  templateUrl: './association-header.component.html',
})
export class AssociationHeaderComponent {
  associationPagination = input.required<Pagination<AssociationItem>>();
  previousAssociation = output();
  nextAssociation = output();
}
