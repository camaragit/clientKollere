import {Component, ViewChild} from '@angular/core';
import {ModalController, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {TabsPage} from "../pages/tabs/tabs";
import {GateauxPage} from "../pages/gateaux/gateaux";
import {RestaurantPage} from "../pages/restaurant/restaurant";
import {MesTicketsPage} from "../pages/mes-tickets/mes-tickets";
import {SchoolPage} from "../pages/school/school";
import {MesKolleresPage} from "../pages/mes-kolleres/mes-kolleres";
import {Storage} from "@ionic/storage";
import {LoginPage} from "../pages/login/login";
import {HeaderColor} from "@ionic-native/header-color";
import {OneSignal} from "@ionic-native/onesignal";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {MessagePage} from "../pages/message/message";
import {PublicitePage} from "../pages/publicite/publicite";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = TabsPage;
  pages: Array<{title: string, component: any,icon}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private localnotification:LocalNotifications,private storage:Storage,private modalCrtl:ModalController,private headercolor:HeaderColor,private oneSignal:OneSignal) {
    this.pages = [
      { title: 'Acceuil', component: HomePage,icon:"home" },
      { title: 'Restaurant', component: RestaurantPage,icon:'restaurant' },
      { title: 'Anniversaire', component: GateauxPage,icon:'fa fa-birthday-cake' },
      { title: 'Kolleré School', component: SchoolPage,icon:'md-school' }

    ];
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
     // splashScreen.hide();
      this.headercolor.tint("#999000");

      this.oneSignal.startInit('1005eae2-1eaa-4919-a85f-439f45f74718', '421267882353');
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

     // this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

      this.oneSignal.handleNotificationReceived().subscribe((data) => {
        // do something when notification is received
       /* let mod= this.modalCrtl.create(MessagePage,{val:data},{cssClass: "test"});
        mod.present();*/

      });

      this.oneSignal.handleNotificationOpened().subscribe((data) => {
        // do something when a notification is opened
        let mod= this.modalCrtl.create(data.notification.payload.bigPicture?PublicitePage:MessagePage,{val:data},{cssClass: "test"});
        mod.present();
      });

      this.oneSignal.endInit();


    });
  }
  openPage(page){
   // this.nav.getActiveChildNav().select(0);
/*    if(page.title!='Anniversaire')
      this.versticket();
    else*/
    this.nav.push(page.component)
  }
  vershome(){
    this.nav.setRoot(HomePage)
  }
  versticket(){
   // this.gCrtl.showToast("En cours de developpement");
   this.nav.push(MesTicketsPage)
  }
  versmeskolleres(){
    this.storage.get("user").then(val => {
      if(val!=null){
        this.nav.push(MesKolleresPage,{user:val})

      }
      else {
        let mod= this.modalCrtl.create(LoginPage);
        mod.present();
        mod.onDidDismiss(d=>{
         this.vershome();
        })
      }
    })
  }
}

