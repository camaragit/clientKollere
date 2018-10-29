import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocalProductPage } from './local-product';

@NgModule({
  declarations: [
    LocalProductPage,
  ],
  imports: [
    IonicPageModule.forChild(LocalProductPage),
  ],
})
export class LocalProductPageModule {}
