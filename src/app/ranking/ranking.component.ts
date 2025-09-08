import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../shared/services/common.service';
import { ApiService } from '../shared/services/api.service';
import { API } from '../shared/constants/constant';
import { ToastrService } from 'ngx-toastr';
import { ContestService } from 'src/app/shared/services/contest.service';
import { SupabaseService } from '../shared/services/supabase.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit, OnDestroy  {
  sidebarBtn: any = false;
  isShowComp: any;
  isOn: boolean = false;
  userDetails: any;
  isUserVerified: any;
  profileData: any;
  isLoading:boolean = false;
  accountList:any = [];
  dataContestActive: any[] = []; 
  labelOn: string = 'On';      // fallback text
  labelOff: string = 'Off';    // fallback text
  valueOn: number = 0; // fallback underlying value
  valueOff: number = 0;
  selectedRankingId: number = environment.DEFAULT_ID_CONTEST;
  countdown: number = 600; // 10 minutes (600 seconds)
  private countdownSubscription!: Subscription;
  private refreshInterval = 600000; // 10 minutes in milliseconds


  constructor(
    public commonService: CommonService,
    private router: Router,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private contestService: ContestService,
    private supabaseService: SupabaseService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    
    setInterval(() => {
      const sideBarclose = this.apiService.getSideBarStatus()
      if (sideBarclose) {
        this.sidebarBtn = false
        this.apiService.SideBarUpdateByMenu()
      }
    }, 1000);
    this.commonService.scrollToTop();
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.selectedRankingId = id;
        this.contestService.setContestId(this.selectedRankingId);         
        // this.startCountdown();
      }
    });
    this.startMalaysiaTimeCountdown();
    
    this.contestService.getLeaderboardObservable().subscribe((data) => {
      // this.accountList = data;
      this.accountList = data.filter(item => item.performance >= 0); // Remove negative values
    },
    () => {
      this.isLoading = false;
    }); 
    this.getListContestActive();
  }

  getLimitedRows(): any[] {
    return this.accountList.slice(0, 20); // Get first 20 rows
  }

  getGainClass(gain: number): string {
    if (gain > 0) return 'gain-positive';
    if (gain < 0) return 'gain-negative';
    return 'gain-neutral';
  }

  formatGain(gain: number): string {
    if (gain > 0) return `+ ${gain}`;
    if (gain < 0) return `${gain}`;
    return `${gain}`;
  }

  toggleSwitch(): void { 
    this.isOn = !this.isOn; 
     const currentValue = this.isOn ? this.valueOn : this.valueOff; 
     this.contestService.setContestId(currentValue); 
  }

  getListContestActive(){
    this.supabaseService.getAllRows('contests').then((data) => {
      // console.log(data);
      this.dataContestActive = data;
       for (let index = 0; index < data.length; index++) {
          const element = data[index];
          if (index==0) {
            this.isOn = element.is_on;
          
            this.labelOff = element.contest_name || 'Off';      
            this.valueOff = element.id_contest || 1;
          }
          else{
            this.labelOn = element.contest_name || 'On';
            this.valueOn = element.id_contest || 0;
          } 
        }
    },
  () => {
    this.isLoading = false;
  });
  }

  startMalaysiaTimeCountdown() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

    this.updateCountdown(); // Set initial countdown
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.updateCountdown();
    });
  }

  updateCountdown() {
    const now = new Date();
    const mytNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));

    const minutes = mytNow.getMinutes();
    const seconds = mytNow.getSeconds();

    // Find the next 10-minute interval (e.g., 00:10, 00:20, 00:30, ...)
    const nextInterval = Math.ceil(minutes / 10) * 10;
    
    let remainingMinutes = nextInterval - minutes;
    let remainingSeconds = 60 - seconds;

    // If exactly at a 10-minute mark, reset to full 10-minute countdown
    if (remainingMinutes === 0 && remainingSeconds === 60) {
      remainingMinutes = 10;
      remainingSeconds = 0;
    }

    this.countdown = remainingMinutes * 60 + remainingSeconds;
  }


  startCountdown() { 
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

    this.countdown = this.refreshInterval / 1000; // Reset countdown to 10 minutes

    this.countdownSubscription = interval(1000).subscribe(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.resetCountdown(); // Reset countdown when it reaches 0
      }
    });
  }

  /**
   * Resets the countdown when data refreshes
   */
  resetCountdown() {
    this.countdown = this.refreshInterval / 1000; // Reset countdown to 10 minutes
  }

  ngOnDestroy() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
 
  getContestList(id: number){
    this.isLoading = true;
    this.contestService.getLeaders(id).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.accountList = res;
        // for (let index = 0; index < res.length; index++) {
        //   const element = res[index]
        //   if (element.type.category != 'demo' ) {
        //     if(index == 0){
        //       this.selectedAccount(element.loginSid)
        //     }
        //     this.totalAccList.push(element)
        //   }
        // }
        // this.dropdownArray()
      }
    }, (err: any) => {
      this.isLoading = false;
      console.log(err);
      // this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    },    
    () => {
      // Complete callback (only runs if there's NO error)
      this.isLoading = false;
      console.log('Finished successfully');
    }) 
  }
}
