import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
//import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {Http} from "@angular/http";
import 'rxjs/add/operator/map';
/**
 * Generated class for the RecapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recap',
  templateUrl: 'recap.html',
})
export class RecapPage {
  recapdata:any={};

  constructor(public navCtrl: NavController,private http:Http,private loadingCtrl:LoadingController,private viewCrtl:ViewController, public navParams: NavParams) {
    this.recapdata =  this.navParams.get('recapdata');
    let i=0;
    while (i<this.recapdata.datalivraison.length && this.recapdata.datalivraison[i].adresse !== this.recapdata.clients.adresse )
                i++;
    this.recapdata.prixlivraisonk = this.recapdata.datalivraison[i].livraisonKollere;
    this.recapdata.prixlivraisonb = this.recapdata.datalivraison[i].livraisonResto;
    this.recapdata.totalboutique = this.recapdata.boutique*1 + this.recapdata.prixlivraisonb*1;
    this.recapdata.totalkollere = this.recapdata.kollere*1 + this.recapdata.prixlivraisonk*1;
    this.recapdata.showdate = this.formatdate(this.recapdata.clients.datelivraison);
    //alert(JSON.stringify(this.recapdata))
  }

  formatdate(dateparam :string):string{
    let jours = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
    let mois = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    let madate = new Date(dateparam);
    return jours[madate.getDay()]+" "+madate.getDate()+" "+mois[madate.getMonth()]+" "+madate.getFullYear();
  }
  validerCommande(type){
    //this.viewCrtl.dismiss();
    if(type=="save")
    {
      let datliv = this.formaterdate(this.recapdata.clients.datelivraison);
      let url ="http://services.ajit.sn/ws/resto/gencodegateau?gateau="+this.recapdata.idgateau+"&prenom="+encodeURI(this.recapdata.clients.prenom);
      url+="&nom="+encodeURI(this.recapdata.clients.nom)+"&telephone="+encodeURI(this.recapdata.clients.phone)+"&adresse="+encodeURI(this.recapdata.clients.adresse);
      url+="&bougie="+this.recapdata.clients.nbbougie+"&message="+encodeURI(this.recapdata.clients.texte)+"&date="+encodeURI(datliv);
      let loading = this.loadingCtrl.create({
        content: 'Veuillez patienter...'
      });
      loading.present();
      this.http.post(url,{}).map(res=>res.json()).subscribe(data=>{
        loading.dismiss();
        if(data.code && data.code=="0")
        {
          this.viewCrtl.dismiss(data);
        }
        else{
          //erreur
        }
      },err=>{
        loading.dismiss();
      })
    }
    else this.viewCrtl.dismiss();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecapPage');
    //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

  }
  formaterdate(date){
    return date.substr(8,2)+"-"+date.substr(5,2)+"-"+date.substr(0,4);

  }

}
