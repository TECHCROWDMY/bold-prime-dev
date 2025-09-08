import { Component } from '@angular/core';

@Component({
  selector: 'app-redeem',
  templateUrl: './redeem.component.html',
  styleUrls: ['./redeem.component.scss']
})
export class RedeemComponent {
  selectedRadio: string = 'Default';
  radioList:string[] = ['Default', 'Points: Lowest', 'Points: Highest', 'Time Added: Least Recent', 'Time Added: Most Recent'];
  filteredItems: string[] = [...this.radioList];
  searchInput: String = '';
  typingTimer: any;
  isVisible: boolean = false;
 

  ngOnInit() {
    // console.log(this.selectedOption);
  }



  searchHandle(event: any) {
    this.searchInput = event.target.value;
    this.filteredItems = this.radioList.filter(item =>
      item.toLowerCase().includes(this.searchInput.toLowerCase())
    );

    if (this.searchInput.length == 0) {
      this.filteredItems = this.radioList
      
    };
  }

  handleClickFilter() {
    this.isVisible = !this.isVisible;
  }

  onRadioButtonChange(event: Event): void {
    this.isVisible = !this.isVisible;
  }
  
}
