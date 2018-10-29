import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {ClientPage} from "../client/client";
import {GateauxServiceProvider} from "../../providers/gateaux-service/gateaux-service";
import {Toast} from "@ionic-native/toast";
import {LocalProductPageModule} from "../local-product/local-product.module";
import {LocalProductPage} from "../local-product/local-product";

@Component({
  selector: 'page-gateaux',
  templateUrl: 'gateaux.html',
})
export class GateauxPage {

  gender :any;
  header_data:any;
  gateaux :any = {};
  resto :any = [];
  tabpart : Array<{description: string}>=[];
  arr:any ;
  svg: any ;
  isOn:Boolean=false;
  mode :any;



  constructor(private navCrtl:NavController,private gCrtl:GateauxServiceProvider,private navParams:NavParams) {this.header_data={title:"Gâteaux anniversaire",search:true,isOn:false};
  this.mode = this.navParams.get("mode")? this.navParams.get("mode"): 'gateaux';
   this.gCrtl.afficheloading();
   if(this.mode == 'gateaux')
   {
     this.gCrtl.getpost("http://services.ajit.sn/ws/resto/typegateaux").then(data=>{
       this.gCrtl.dismissloadin();
       this.arr =JSON.parse(data.data) ;
       this.svg =this.arr;
       console.log(this.arr);
       // alert(JSON.stringify(data))
     }).catch(err=>{
       this.gCrtl.dismissloadin();
       this.gCrtl.showToast("Probleme de connexion internet");

     })
   }
   //restaurant
   else {
     this.gCrtl.getpost("http://services.ajit.sn/ws/resto/listitemsfamille?famille=PLATS LOCAUX").then(data=>{
       this.gCrtl.dismissloadin();

       this.arr =JSON.parse(data.data) ;
       this.svg =this.arr;
       console.log(this.arr);
     }).catch(err=>{
       this.gCrtl.dismissloadin();
       this.gCrtl.showToast("Probleme de connexion");
     })
   }


  }

  toggleRecherche() {
  //  this.header_data.isOn = !this.header_data.isOn;
    this.isOn = !this.isOn;
  }
  filtergateau(ev: any) {
    this.arr =this.svg
    let serVal = ev.target.value;
    if (serVal && serVal.trim() != '') {
      this.arr = this.arr.filter((montab) => {
        return (montab.toLowerCase().indexOf(serVal.toLowerCase()) >= 0 );
      })
    }
  }
  unlock() {


  }


  verscommande(item){
    if(this.mode=='gateaux')
      this.navCrtl.push(ClientPage,{data:item});
    else this.navCrtl.push(LocalProductPage,{data:item})

  }
  viderchamps(){
    this.gateaux.resto= this.gateaux.nbpart=null;
  }


  ionViewDidLoad() {
    this.unlock();
  }



}
