import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {UserpopoverPage} from "../userpopover/userpopover";
import {LoginPage} from "../login/login";
import {HomePage} from "../home/home";

/**
 * Generated class for the PanierPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-panier',
  templateUrl: 'panier.html',
})
export class PanierPage {
  paniers :any;
  user:any=null;


  constructor(public navCtrl: NavController, public navParams: NavParams,private storage:Storage,private modalCrtl:ModalController,private popoverCtrl:PopoverController) {
    this.paniers = this.navParams.get("panier");
    this.paniers.type = "restaurant";
    this.storage.remove("codepanier");

    this.loaduser();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PanierPage');
  }
  loaduser(){
    this.storage.get("user").then(val=>{
      // this.header_data.user = val;
      this.user = val;


    })
  }
  vershome(){
    this.navCtrl.setRoot(HomePage)
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
}
