import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  constructor(
    public router : Router,
    public commonService: CommonService,
    private apiService: ApiService,
  ){}

  ngOnInit() { }


  headerLogo(){
    this.router.navigate(['/app/dashboard']);
  }
}
