import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {GateauxServiceProvider} from "../../providers/gateaux-service/gateaux-service";
import {UserpopoverPage} from "../userpopover/userpopover";
import {CadeauxPage} from "../cadeaux/cadeaux";

/**
 * Generated class for the MesKolleresPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mes-kolleres',
  templateUrl: 'mes-kolleres.html',
})
export class MesKolleresPage {
  minDate:any;
  datedebut:any;
  datefin:any;
  kolleres:any=null;
  user:any;
  totalpoint:any;
  totalachat:any;


  constructor(public navCtrl: NavController, public navParams: NavParams,private gCrtl:GateauxServiceProvider,private popoverCtrl:PopoverController) {
    this.user= this.navParams.get("user");

    this.afficher();
  }
  resetmindate(){

    let dateParts = this.datedebut.split("-");

    let dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    this.minDate = new Date(this.datedebut).toISOString()
  }
  resetdatefin(){
    this.datefin = "";
  }
  afficher(){
    let datej = new Date();
    datej.getFullYear();
    let datedeb = "01-01-"+datej.getFullYear();
    let mois = (datej.getMonth()+1) >=  10 ? datej.getMonth()+1: "0"+(datej.getMonth()+1);
    let datefin = datej.getDate()>=10 ? datej.getDate()+"-"+mois+"-"+datej.getFullYear():"0"+datej.getDate()+"-"+mois+"-"+datej.getFullYear();
    console.log(datedeb)
    console.log(datefin)
    this.kolleres=null;
    this.gCrtl.afficheloading();
    let url = "http://services.ajit.sn/ws/common/detailachats?datedebut="+datedeb+"&datefin="+datefin+"&email="+this.user.username;
    console.log(url);
    this.gCrtl.getpost(url).then(data=>{
      this.gCrtl.dismissloadin();
      let val = JSON.parse(data.data);
      if(val.code=="0")
      {
        console.log(val)

        this.totalachat = val.total;
        this.totalpoint = 0;
        for(let i=0;i<val.lPointCommerces.length;i++)
        {
          this.totalpoint += val.lPointCommerces[i].point*1;

        }
        this.kolleres = val.lPointCommerces;

      }
      else{
        this.gCrtl.showError("Pas d'achats éffectués à cette période")
      }

    }).catch(err=>{
      this.gCrtl.dismissloadin();
      this.gCrtl.showToast("Pas d'achats éffectués")
    })

  }
  useroptions(myEvent){
    let popover = this.popoverCtrl.create(UserpopoverPage);
    popover.present({
      ev: myEvent
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MesKolleresPage');
  }
  verscadeaux(item){

    this.navCtrl.push(CadeauxPage,{"kollere":item,"user":this.user});
  }

}
