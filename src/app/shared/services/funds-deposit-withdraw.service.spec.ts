import { TestBed } from '@angular/core/testing';

import { FundsDepositWithdrawService } from './funds-deposit-withdraw.service';

describe('FundsDepositWithdrawService', () => {
  let service: FundsDepositWithdrawService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundsDepositWithdrawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
