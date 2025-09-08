import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-payment-verify-failed',
  templateUrl: './payment-verify-failed.component.html',
  styleUrls: ['./payment-verify-failed.component.scss']
})
export class PaymentVerifyFailedComponent {
  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {
    // this.route.snapshot.paramMap.get('id')

    this.apiService.setDepositStatus('failed');
    this.router.navigate(['/app/transactions-history']);

  }

}
