import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientPage } from './client';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    ClientPage,
  ],
  imports: [
    IonicPageModule.forChild(ClientPage),ComponentsModule
  ],
})
export class ClientPageModule {}
