import { TestBed } from '@angular/core/testing';

import { AxioshttpService } from './axioshttp.service';

describe('AxioshttpService', () => {
  let service: AxioshttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AxioshttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
