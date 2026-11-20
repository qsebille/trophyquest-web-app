import {TestBed} from '@angular/core/testing';

import {NotificationService} from './notification.service';
import {NotificationToastComponent} from './notification-toast.component';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('renders notifications added after the toast component is initialized', () => {
    const fixture = TestBed.createComponent(NotificationToastComponent);
    fixture.autoDetectChanges();
    expect(fixture.nativeElement.querySelector('ngb-toast')).toBeNull();

    service.sendSuccess('Suite title updated.');
    TestBed.tick();

    expect(fixture.nativeElement.querySelector('ngb-toast')?.textContent).toContain('Suite title updated.');
  });
});
