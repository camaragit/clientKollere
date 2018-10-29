import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsTicketPage } from './details-ticket';

@NgModule({
  declarations: [
    DetailsTicketPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailsTicketPage),
  ],
})
export class DetailsTicketPageModule {}
