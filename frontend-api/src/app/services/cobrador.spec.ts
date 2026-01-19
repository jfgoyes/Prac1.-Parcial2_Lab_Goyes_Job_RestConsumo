import { TestBed } from '@angular/core/testing';

import { CobradorService } from './cobrador';

describe('CobradorService', () => {
  let service: CobradorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CobradorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
