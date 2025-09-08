import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RankingComponent } from './ranking.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxLoaderIndicatorModule } from 'ngx-loader-indicator';
import { RankingRoutingModule } from './ranking-routing.module';
import { TimerFormatPipe } from '../shared/timer-format.pipe';
// import { LinksRoutingModule } from './links-routing.module';
// import { GoComponent } from './go/go.component';
const routes: Routes = [
  { path: ':id', component: RankingComponent }, // Accepts "id" in child route
  { path: '', redirectTo: '1', pathMatch: 'full' }, // Default ID to 1
];

@NgModule({
  declarations: [RankingComponent, TimerFormatPipe],
  imports: [RouterModule.forChild(routes), CommonModule, SharedModule, FormsModule, ReactiveFormsModule, RankingRoutingModule,
    NgxLoaderIndicatorModule.forRoot({
      img: './assets/images/loader.gif',
      imgStyles: {
        width: '60px',
      },
      loaderStyles: {
        background: 'rgba(255, 255, 255, 0.75)',
      },
    }),
  ],
})
export class RankingModule {}
