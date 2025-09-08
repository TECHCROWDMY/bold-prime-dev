import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-payment-verify',
  templateUrl: './payment-verify.component.html',
  styleUrls: ['./payment-verify.component.scss']
})
export class PaymentVerifyComponent {

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {
    // this.route.snapshot.paramMap.get('id')

    this.apiService.setDepositStatus('success');
    this.router.navigate(['/app/transactions-history']);

  }


}
