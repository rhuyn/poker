import { TestBed, inject } from '@angular/core/testing';

import { ValidityService } from './validity.service';

describe('ValidityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidityService]
    });
  });

  it('should be created', inject([ValidityService], (service: ValidityService) => {
    expect(service).toBeTruthy();
  }));
});
