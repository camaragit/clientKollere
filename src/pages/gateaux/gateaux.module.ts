import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GateauxPage } from './gateaux';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    GateauxPage,
  ],
  imports: [
    IonicPageModule.forChild(GateauxPage),ComponentsModule
  ],
})
export class GateauxPageModule {}
