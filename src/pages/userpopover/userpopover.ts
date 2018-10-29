import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {LoginPage} from "../login/login";
import {UpdatepasswordPage} from "../updatepassword/updatepassword";
import {GateauxServiceProvider} from "../../providers/gateaux-service/gateaux-service";
import {MesKolleresPage} from "../mes-kolleres/mes-kolleres";

/**
 * Generated class for the UserpopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-userpopover',
  templateUrl: 'userpopover.html',
})
export class UserpopoverPage {
  user:any;

  constructor(public navCtrl: NavController,private gCrtl:GateauxServiceProvider,public navParams: NavParams,private storage:Storage,private viewCrlt:ViewController,private modalCrtl:ModalController) {
    this.loaduser();
  }
  loaduser(){
    this.storage.get("user").then(val=>{
      // this.header_data.user = val;
      this.user = val;

    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserpopoverPage');
  }

logout(){
    this.storage.remove("user");
    this.viewCrlt.dismiss();
}
  checkvaliditecarte(){
    let url = "http://services.ajit.sn/ws/resto/abonnement?numtel="+this.user.telephone;
    this.gCrtl.afficheloading();
    this.viewCrlt.dismiss();
    this.gCrtl.getpost(url).then(data=>{
      this.gCrtl.dismissloadin();
      let val = JSON.parse(data.data)
      if(val.code=="0"){
        this.gCrtl.showAlert(val.prenom +" "+val.nom+" votre carte expire dans "+val.validite+"jour(s)")
      }
      else this.gCrtl.showError(val.message);

    }).catch(err=>{
      this.gCrtl.dismissloadin();
      this.viewCrlt.dismiss();
      this.gCrtl.showToast("Probleme de connexion");

    })

  /*  let mod= this.modalCrtl.create(UpdatepasswordPage);
    mod.present();
    mod.onDidDismiss(d=>{

    })*/
    this.viewCrlt.dismiss();
  }



}
