import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GateauxServiceProvider} from "../../providers/gateaux-service/gateaux-service";
import {ClientPage} from "../client/client";
import {MonRestoPage} from "../mon-resto/mon-resto";
import {CommandeMonRestoPage} from "../commande-mon-resto/commande-mon-resto";

/**
 * Generated class for the FamillePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-famille',
  templateUrl: 'famille.html',
})
export class FamillePage {

  items:any;
  svg:any;
  user:any;
  famille:any;
  isOn:any;
  restos:any;
  schoolitems:any;
  restaurant:any=null;
  tarifsResato:any=[]
  constructor(public navCtrl: NavController, public navParams: NavParams,private gCrtl:GateauxServiceProvider) {
    this.schoolitems = this.navParams.get("items");
    this.restaurant = this.navParams.get("resto");
    //les restos standards
    if(this.schoolitems==null){
      this.famille = this.navParams.get("famille");
      this.gCrtl.afficheloading();
     let rststandart = "http://services.ajit.sn/ws/resto/listitemsfamille?famille="+encodeURI(this.famille);

      let url= this.restaurant!=null?"http://services.ajit.sn/ws/resto/listitemsfamillecommerce?famille="+encodeURI(this.famille)+"&commerce="+encodeURI(this.restaurant):rststandart;
      console.log(url);
      this.gCrtl.getpost(url).then(rep=>{
        this.gCrtl.dismissloadin();
        rep.data = JSON.parse(rep.data);
        this.items =rep.data;
        this.svg=this.items;

      }).catch(err=>{
        this.gCrtl.dismissloadin();
        this.gCrtl.showToast("Probleme de connexion");
      })
    }
    //les écoles
    else{
      this.famille = this.schoolitems.famille;
      this.items =this.schoolitems;
    }


  }
  toggleRecherche() {
    this.isOn = !this.isOn;
  }
  verscommande(item){
    if(this.schoolitems)
    {
      item.famille = this.schoolitems.famille;
      item.ecole = this.schoolitems.ecole;
      this.navCtrl.push(ClientPage,{itemschool:item});
    }
    else {
      if(this.restaurant==null)
      {
        this.gCrtl.afficheloading();
        this.gCrtl.getpost("http://services.ajit.sn/ws/resto/tarifsrestoitem?item="+encodeURI(item)+"&commerce=commerce")
          .then(data=>{
            this.gCrtl.dismissloadin();
            this.restos = {};
            let tab =[];
            data.data = JSON.parse(data.data);
            for(let i=0;i<data.data.length;i++)
            {
              if(data.data[i].item!=""){
                tab.push(data.data[i])
              }
            }
            this.restos.item = item;
            this.restos.restos = tab;
            this.restos.famille = this.famille;
            if(this.restaurant==null)
              this.navCtrl.push(ClientPage,{restos:this.restos});

          }).catch(err=>{
          this.gCrtl.dismissloadin();
          this.gCrtl.showToast("Probleme de connexion");
        })
      }
      else{
        let  url = "http://services.ajit.sn/ws/resto/tarifsrestoitem?item="+encodeURI(item)+"&commerce="+encodeURI(this.restaurant);
        console.log(url)
        this.gCrtl.afficheloading();
        this.gCrtl.getpost(url).then(data=>{
          this.gCrtl.dismissloadin();
          let rep = JSON.parse(data.data);
          console.log(rep)
          if(rep.code!="1")
          {
            this.tarifsResato=[];
            for(let i=0;i<rep.length;i++)
            {
              if(rep[i].item!=""){
                this.tarifsResato.push(rep[i]);
              }
            }
            let params ={resto:this.restaurant,tarif:this.tarifsResato,famille:this.famille,item:item};
            console.log("params "+JSON.stringify(params))
            this.navCtrl.push(CommandeMonRestoPage,params)

          }
          else{
            this.gCrtl.showError(rep.message)
          }
        }).catch(err=>{
          this.gCrtl.dismissloadin();
          this.gCrtl.showError("Probleme de connexion")
        })

      }

    }



  }
  filterproduit(ev: any) {
    this.items =this.svg;
    let serVal = ev.target.value;
    if (serVal && serVal.trim() != '') {
      this.items = this.items.filter((montab) => {
        return (montab.toLowerCase().indexOf(serVal.toLowerCase()) >= 0 );
      })
    }
  }
  changementproduit(){

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FamillePage');
  }

}
