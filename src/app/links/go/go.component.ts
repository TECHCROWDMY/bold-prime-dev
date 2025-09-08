import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-go',
  templateUrl: './go.component.html',
  styleUrls: ['./go.component.scss'],
})
export class GoComponent implements OnInit {
  paramValue: string = '';
  userInfo: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.paramValue = params.get('id') || '';
      const storedUserDetail = localStorage.getItem('boldUserDetail');
      this.userInfo = storedUserDetail ? JSON.parse(storedUserDetail) : '';
      this.navigateToAnotherRoute();
    });
  }

  navigateToAnotherRoute(): void {
    this.router.navigate(['/signup/'], {
      queryParams: { lid: this.paramValue, pid: this.userInfo.id },
    });
  }

  logoutUser(): void {
    this.apiService.callApiPostRequest(API.LOGOUT, {}).subscribe();
    localStorage.clear();
    this.router.navigate([`login`]);
  }
}
