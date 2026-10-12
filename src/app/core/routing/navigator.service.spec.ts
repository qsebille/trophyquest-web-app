import {TestBed} from '@angular/core/testing';

import {Navigator} from './navigator.service';

describe('NavigatorService', () => {
  let service: Navigator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Navigator);
  });

  it('should be created', () => expect(service).toBeTruthy());
});
