import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MesTicketsPage } from './mes-tickets';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    MesTicketsPage,
  ],
  imports: [
    IonicPageModule.forChild(MesTicketsPage),ComponentsModule
  ],
})
export class MesTicketsPageModule {}
