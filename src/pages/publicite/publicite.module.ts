import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicitePage } from './publicite';

@NgModule({
  declarations: [
    PublicitePage,
  ],
  imports: [
    IonicPageModule.forChild(PublicitePage),
  ],
})
export class PublicitePageModule {}
