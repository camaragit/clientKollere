import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadeauxPage } from './cadeaux';

@NgModule({
  declarations: [
    CadeauxPage,
  ],
  imports: [
    IonicPageModule.forChild(CadeauxPage),
  ],
})
export class CadeauxPageModule {}
