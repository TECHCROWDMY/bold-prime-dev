import { Component } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import * as scriptjs from 'scriptjs';
import { Title } from '@angular/platform-browser';
declare const MetaTraderWebTerminal: any;
@Component({
  selector: 'app-mb4-web-trader',
  templateUrl: './mb4-web-trader.component.html',
  styleUrls: ['./mb4-web-trader.component.scss']
})

export class Mb4WebTraderComponent {

  constructor(
    public commonService: CommonService,
    private titleService: Title,
  ) {

   }

  ngOnInit() {
    this.commonService.setCurrentActiveLink('mb4webtrader');
    this.commonService.pageName = 'Mb4 Web Trader';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    scriptjs('https://metatraderweb.app/trade/widget.js', () => {
      // The script has been loaded, you can use it here
      // For example, initialize MetaTraderWebTerminal here
      new MetaTraderWebTerminal("webterminal", {
        version: 4,
        servers: ["BoldPrime-Demo", "BoldPrime-Live", "BoldPrime2-Live"],
        server: "BoldPrime-Live",
        demoAllServers: true,
        utmSource: "www.boldprime.com",
        startMode: "login",
        language: "en",
        colorScheme: "black_on_white"
      });
    });
  }

}
