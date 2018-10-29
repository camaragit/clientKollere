import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import {LoadingController, ModalController, NavController, PopoverController} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {Toast} from "@ionic-native/toast";
import {GloabalVariable} from "./GloabalVariable";
/*
  Generated class for the GateauxServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GateauxServiceProvider {
  loading:any;

  constructor(public http: HTTP,private popoverCtrl:PopoverController,private Gbl:GloabalVariable,private modalCrtl:ModalController,private loadingCtrl:LoadingController,private alertCtrl:AlertController,private toast:Toast) {
    console.log('Hello GateauxServiceProvider Provider');
     this.loading = this.loadingCtrl.create({
      content: 'Veuillez patienter...',dismissOnPageChange:true,enableBackdropDismiss:true
    });
  }
  showToast(message){
    this.toast.showLongCenter(message).subscribe(value => {
      console.log(value)
    })
  }

  getpost(url:string,body:any={},headers:any={}):any{
    headers.type_requete = "MOBILE";
    headers.withcard='1';
    console.log(headers);
    return this.http.post(url,body,headers);
  }
afficheloading(){
  if(!this.loading){
    this.loading = this.loadingCtrl.create({
      content: 'Veuillez patienter...'
    });
    this.loading.present();
  }
  else this.loading.present();
}

dismissloadin(){
 //this.loading.dismiss();
  if(this.loading){
    this.loading.dismiss();
    this.loading = null;
  }
}
  showAlert(message :string){
    let alert = this.alertCtrl.create({
      title: 'Kollere',
      subTitle: message,
      cssClass:'alertSucces',
      buttons: ['OK']
    });
    alert.present();

  }
  showError(message:string){
    let alert = this.alertCtrl.create({
      title: 'Kollere',
      subTitle: message,
      cssClass:'alertDanger',
      buttons: ['OK']
    });
    alert.present();
  }
   millier(valeur){
    valeur=valeur+"";
    valeur = valeur*1;
    //partie entiere avec separateur
    let pentier="";
    //partie decimal avec separateur
   let pdecimal="";
    //si la veleur comporte une une partie decimale
    if(valeur.toString().indexOf('.')!=-1){

      //partie décimale sans separateur
    let  partiedecimal=""+valeur.toString().substring(valeur.toString().indexOf('.')+1,valeur.toString().length);
      //partie entiere sans separateur
      let  partieentiere=valeur.toString().substring(0,valeur.toString().indexOf('.'))+"";
      let j=partieentiere.length;
      //Séparation partie entiere
      while(j>3)
      {
        pentier=" "+partieentiere.substring(j-3,j)+pentier;
        j-=3;
      }
      pentier= partieentiere.substring(0,j)+pentier;
      j=partiedecimal.length;
      while(j>3)
      {
        pdecimal=" "+partiedecimal.substring(j-3,j)+pdecimal;
        j-=3;
      }

      pdecimal= partiedecimal.substring(0,j)+pdecimal;

      return pentier+'.'+pdecimal;
    }
    else {
      let  j=valeur.toString().length;
      let val="";
      while(j>3)
      {
        val=" "+valeur.toString().substring(j-3,j)+val;
        j-=3;
      }
      return valeur.toString().substring(0,j)+val;

    }

  }
}
