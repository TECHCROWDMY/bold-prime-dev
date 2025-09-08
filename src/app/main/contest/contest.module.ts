import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContestRoutingModule } from './contest-routing.module';
import { ContestLeadersComponent } from './contest-leaders/contest-leaders.component';


@NgModule({
  declarations: [
    ContestLeadersComponent
  ],
  imports: [
    CommonModule,
    ContestRoutingModule
  ]
})
export class ContestModule { }
