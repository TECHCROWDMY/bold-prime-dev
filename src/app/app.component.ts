import { Component } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bold Prime';
 constructor(
    public commonService: CommonService,
    private router: Router,
  ) {
    // if (!this.commonService.checkUserLogin()) {
    //   this.router.navigate(['/login']);
    // }
  }

  ngOnInit() {

  }
}
