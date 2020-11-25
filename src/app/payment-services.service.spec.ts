import { TestBed } from '@angular/core/testing';

import { PaymentServicesService } from './payment-services.service';

describe('PaymentServicesService', () => {
  let service: PaymentServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
