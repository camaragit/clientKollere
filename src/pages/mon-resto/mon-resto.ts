import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {GateauxServiceProvider} from "../../providers/gateaux-service/gateaux-service";
import {FamillePage} from "../famille/famille";
import {UserpopoverPage} from "../userpopover/userpopover";
import {Storage} from "@ionic/storage";
import {LoginPage} from "../login/login";

/**
 * Generated class for the MonRestoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mon-resto',
  templateUrl: 'mon-resto.html',
})
export class MonRestoPage {
  restaurant:any;
  familles:any=[];
  restaurants:any=[];
  user:any;
  constructor(private modalCrtl:ModalController,private storage:Storage,public navCtrl: NavController, public navParams: NavParams,private gCrtl:GateauxServiceProvider,private popoverCtrl:PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchoolPage');
    this.gCrtl.afficheloading();
    this.loaduser();
    this.gCrtl.getpost("http://services.ajit.sn/ws/common/agentresto/").then(rep=>{
      this.gCrtl.dismissloadin();
      rep.data = JSON.parse(rep.data);
      let t = rep.data.length;
      if(t>0)
      {
        for(let i=0;i<t;i++)
        {
          if(rep.data[i]!=null){
            this.restaurants.push(rep.data[i]);
          }
        }
      }
      else{
        this.gCrtl.showError("Aucun restaurant trouvé")
      }

    }).catch(err=>{
      this.gCrtl.dismissloadin();
      this.gCrtl.showToast("Probleme de connexion");
    })
  }
  changementrestaurant(){
    let url="http://services.ajit.sn/ws/resto/listfamillescommerce?commerce="+encodeURI(this.restaurant);
    console.log(url);
    this.gCrtl.afficheloading();
    this.gCrtl.getpost(url).then(rep=>{
      this.gCrtl.dismissloadin();
      rep.data = JSON.parse(rep.data);
      let taille = rep.data.length;
      this.familles =[];
      if(taille>0){
        for(let i=0;i<taille;i++)
        {
          if(rep.data[i]!=null){
            this.familles.push(rep.data[i]);
          }
        }
      }
      else this.gCrtl.showError("Pas de famille pour cette boutique")


    }).catch(err=>{
      this.gCrtl.dismissloadin();
      this.gCrtl.showToast("Probleme de connexion");
    })
  }
  verscommande(item){
    this.navCtrl.push(FamillePage,{famille:item,resto:this.restaurant});
  }
  useroptions(myEvent){
    console.log("Home mon evenement ==>"+myEvent)
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
      this.user = val;
    })
  }
  pending(){
    let mod= this.modalCrtl.create(LoginPage,{},{cssClass: "test"});
    mod.present();
    mod.onDidDismiss(d=>{
      this.loaduser();
    })
  }

}
