import { Component, ElementRef, OnInit, Renderer2, } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-educational-videos',
  templateUrl: './educational-videos.component.html',
  styleUrls: ['./educational-videos.component.scss']
})
export class EducationalVideosComponent implements OnInit {
  boldUser:any;
  constructor(
    public commonService: CommonService,
    private elRef: ElementRef, 
    private renderer: Renderer2,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.boldUser = JSON.parse(localStorage.getItem('boldUserDetail') || '');
    this.commonService.setCurrentActiveLink('educational-videos');
    this.commonService.pageName = 'Educational Videos';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.loadScript('https://iframe.trainyourtraders.com/sdk.js');
  }

  private loadScript(src: string) {
    const script = this.renderer.createElement('script');
    script.id = 'trainyourtraders-jssdk';
    script.src = src;

    const firstScript = document.getElementsByTagName('script')[0];
    this.renderer.insertBefore(firstScript.parentNode, script, firstScript);
  }
}
