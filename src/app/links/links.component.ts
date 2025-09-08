import { Component, OnInit } from '@angular/core';
import { CommonService } from '../shared/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
})
export class LinksComponent implements OnInit {
  constructor(public commonService: CommonService, private router: Router) {}

  ngOnInit(): void {
    console.log('LinksComponent initialized.');
  }
}
