import { TestBed } from '@angular/core/testing';

import { ProcessHTTPMsgService } from './process-http-msg.service';

describe('ProcessHTTPMsgService', () => {
  let service: ProcessHTTPMsgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessHTTPMsgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
