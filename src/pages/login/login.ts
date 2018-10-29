import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {GateauxServiceProvider} from "../../providers/gateaux-service/gateaux-service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Storage} from "@ionic/storage";
import {OneSignal} from "@ionic-native/onesignal";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
datalogin :FormGroup;

  constructor(public navCtrl: NavController,private oneSignal:OneSignal,private storage: Storage,public navParams: NavParams,private viewCrtl:ViewController,private gCrtl:GateauxServiceProvider,private formBuilder:FormBuilder) {
    this.datalogin = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]

    });
    this.datalogin.controls['password'].setValue('pass');

  }
  goback(type){
    if(type==='login')
    {
      this.gCrtl.afficheloading();
      this.gCrtl.getpost("http://services.ajit.sn/ws/common/connection?email="+encodeURI(this.datalogin.controls['login'].value)+"&password="+encodeURI(this.datalogin.controls['password'].value)).
        then(data=>{
          this.gCrtl.dismissloadin();

       let val = JSON.parse(data.data);
       console.log(val)
       if(val.code=="0")
       {
         this.oneSignal.sendTags({nom:val.nom,prenom:val.prenom,phone:val.telephone})
          val.username = this.datalogin.controls['login'].value;
          this.storage.set("user",val);
         this.viewCrtl.dismiss();
       }
       else{
         this.gCrtl.showError(val.message);
       }
      }).catch(err=>{
        this.gCrtl.dismissloadin();

      })
    }
    else{
      this.viewCrtl.dismiss();
    }

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
