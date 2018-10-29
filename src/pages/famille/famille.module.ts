import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamillePage } from './famille';

@NgModule({
  declarations: [
    FamillePage,
  ],
  imports: [
    IonicPageModule.forChild(FamillePage),
  ],
})
export class FamillePageModule {}
