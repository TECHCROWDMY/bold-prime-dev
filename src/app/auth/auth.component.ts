import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../shared/services/common.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  constructor(public commonService: CommonService, private router: Router) {}

  ngOnInit(): void {}
}
