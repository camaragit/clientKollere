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
    this.gCrtl.getpost(url).then(data=>{
      this.gCrtl.dismissloadin();
      let val = JSON.parse(data.data)
      console.log(JSON.stringify(data));
      if(val.code=="0"){
        //test
        let message = val.validite*1 > 0 ? val.prenom +" "+val.nom+" votre carte expire dans "+val.validite+"jour(s)": val.prenom +" "+val.nom+" votre abonnement a expiré";
        this.gCrtl.showAlert(message)
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
