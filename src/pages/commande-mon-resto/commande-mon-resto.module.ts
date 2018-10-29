import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommandeMonRestoPage } from './commande-mon-resto';

@NgModule({
  declarations: [
    CommandeMonRestoPage,
  ],
  imports: [
    IonicPageModule.forChild(CommandeMonRestoPage),
  ],
})
export class CommandeMonRestoPageModule {}
