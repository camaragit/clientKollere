import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestauModePage } from './restau-mode';

@NgModule({
  declarations: [
    RestauModePage,
  ],
  imports: [
    IonicPageModule.forChild(RestauModePage),
  ],
})
export class RestauModePageModule {}
