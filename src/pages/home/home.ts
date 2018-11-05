import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {GateauxPage} from "../gateaux/gateaux";
import {LoginPage} from "../login/login";
import {Storage} from "@ionic/storage";
import { PopoverController } from 'ionic-angular';
import {UserpopoverPage} from "../userpopover/userpopover";
import {SchoolPage} from "../school/school";
import {SplashScreen} from "@ionic-native/splash-screen";
import {GateauxServiceProvider} from "../../providers/gateaux-service/gateaux-service";
import {OneSignal} from "@ionic-native/onesignal";
import {RestauModePage} from "../restau-mode/restau-mode";
import {GloabalVariable} from "../../providers/gateaux-service/GloabalVariable";


/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  pages: Array<{title: string, component: any,icon}>;
  user:any;
  messages :any;
  header_data:any;
  constructor(private gbl:GloabalVariable,public navCtrl: NavController,private oneSignal:OneSignal,private gCrtl:GateauxServiceProvider,private splashScreen:SplashScreen,private platform :Platform,private popoverCtrl: PopoverController,private storage:Storage,public navParams: NavParams,private modalCrtl:ModalController) {
    this.header_data={title:"Home"};
    this.messages ={};
    this.pages = [
      { title: 'Restaurant', component: RestauModePage,icon:'restaurant' },
      { title: 'Anniversaire', component: GateauxPage,icon:'fa fa-birthday-cake' },
      { title: 'Kolleré School', component: SchoolPage,icon:'md-school' },
      { title: 'Produits locaux', component: GateauxPage,icon:'md-cart' }

    ];



    this.loaduser();
  }
  pending(){
   // this.gCrtl.showToast("En cours de developpement")
   let mod= this.modalCrtl.create(LoginPage,{},{cssClass: "test"});
    mod.present();
    mod.onDidDismiss(d=>{
      this.loaduser();
    })
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
      this.header_data.user = val;
      this.user = val;
      if(val!=null)
      {
        this.gCrtl.getpost(this.gbl.urlsave,{nom:val.nom,prenom:val.prenom,telephone:val.telephone,email:val.username}).then(res=>{}).catch(err=>{});
        this.oneSignal.sendTags({nom:val.nom,prenom:val.prenom,phone:val.telephone})

      }

    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.platform.ready().then(()=>{
      this.splashScreen.hide();
      this.envoyerids();
      this.getMessages();

    });
  }
  getMessages(){
    this.gCrtl.afficheloading();
    let url = "http://services.ajit.sn/ws/common/promokollere";
    console.log(url);
    this.gCrtl.getpost(url).then(data=>{
      this.gCrtl.dismissloadin();
      let val = JSON.parse(data.data);
      console.log(val)
      this.messages = val;

    }).catch(err=>{
      this.gCrtl.dismissloadin();
      this.gCrtl.showToast("Probleme de connexion")
    })
  }
  envoyerids(){
    this.oneSignal.getIds().then(data=>{
      this.oneSignal.sendTags({userid:data.userId,token:data.pushToken})
    })
  }


  verspage(page){
    if(page.title=='Produits locaux')
      this.navCtrl.push(page.component,{mode:'local'})
    else
    //this.app.getRootNav().setRoot(page.component);
    //if(page.title=='Anniversaire')
    this.navCtrl.push(page.component);
   // else this.gCrtl.showToast("En cours de developpement");
  }

}
