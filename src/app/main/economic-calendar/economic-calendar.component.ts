import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-economic-calendar',
  templateUrl: './economic-calendar.component.html',
  styleUrls: ['./economic-calendar.component.scss']
})
export class EconomicCalendarComponent {

  constructor(
    public commonService: CommonService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.commonService.setCurrentActiveLink('economic-calendar');
    this.commonService.pageName = 'Economic Calendar';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
  }
}
