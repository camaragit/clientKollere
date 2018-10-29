import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HomePage} from "../home/home";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the SucesscommandePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sucesscommande',
  templateUrl: 'sucesscommande.html',
})
export class SucesscommandePage {
  successdata:any={};
  localdata :any=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage) {
    this.successdata =this.navParams.get('data');
    this.successdata.newtype="hbd";
   // this.successdata.type=
   // console.log(this.successdata);
//this.storage.clear().then(err=>{})
    this.storage.get('tickets').then((val) => {
      if (!(val == null)) {

        val[val.length] = this.successdata;
        this.storage.set('tickets',val).then(data=>{
          console.log("ajout")
          //console.log(data)
        })

      }
      else {
        this.localdata[0] = this.successdata;
        this.storage.set('tickets', this.localdata).then(val=>{
          console.log("premier ")
         // console.log(val)
        })
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SucesscommandePage');
  }
  vershome(){
    this.navCtrl.setRoot(HomePage)
  }

}
