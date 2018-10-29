import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the PublicitePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-publicite',
  templateUrl: 'publicite.html',
})
export class PublicitePage {
message : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCrtl: ViewController) {
    this.message = this.navParams.get('val').notification.payload;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PublicitePage');
  }
  quitter(){
    this.viewCrtl.dismiss();
  }

}
