import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestaurantPage } from './restaurant';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    RestaurantPage,
  ],
  imports: [
    IonicPageModule.forChild(RestaurantPage),ComponentsModule
  ],
})
export class RestaurantPageModule {}
