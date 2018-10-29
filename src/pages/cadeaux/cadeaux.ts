import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {UserpopoverPage} from "../userpopover/userpopover";
import {LoginPage} from "../login/login";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the CadeauxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cadeaux',
  templateUrl: 'cadeaux.html',
})
export class CadeauxPage {
  kollere:any;
  user:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private popoverCtrl:PopoverController,private modalCrtl:ModalController,private storage:Storage) {
    this.kollere = this.navParams.get("kollere");
    this.loaduser();
  }

  pending(){
    // this.gCrtl.showToast("En cours de developpement")
    let mod= this.modalCrtl.create(LoginPage);
    mod.present();
    mod.onDidDismiss(d=>{
      this.loaduser();
    })
  }
  useroptions(myEvent){
    let popover = this.popoverCtrl.create(UserpopoverPage);
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data=>{
      this.loaduser();
    })
  }
  loaduser(){
    this.storage.get("user").then(val=>{
      // this.header_data.user = val;
      this.user = val;

    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadeauxPage');
  }

}
