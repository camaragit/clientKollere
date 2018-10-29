import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MonRestoPage } from './mon-resto';

@NgModule({
  declarations: [
    MonRestoPage,
  ],
  imports: [
    IonicPageModule.forChild(MonRestoPage),
  ],
})
export class MonRestoPageModule {}
