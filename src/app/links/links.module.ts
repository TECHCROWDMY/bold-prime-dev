import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinksComponent } from './links.component';
import { LinksRoutingModule } from './links-routing.module';
import { GoComponent } from './go/go.component';

@NgModule({
  declarations: [LinksComponent, GoComponent],
  imports: [CommonModule, LinksRoutingModule],
})
export class LinksModule {}
