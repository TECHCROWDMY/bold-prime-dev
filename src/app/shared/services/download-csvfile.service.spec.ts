import { TestBed } from '@angular/core/testing';

import { DownloadCSVFileService } from './download-csvfile.service';

describe('DownloadCSVFileService', () => {
  let service: DownloadCSVFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadCSVFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
