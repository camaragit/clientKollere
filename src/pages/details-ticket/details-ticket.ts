import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GateauxServiceProvider} from "../../providers/gateaux-service/gateaux-service";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the DetailsTicketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details-ticket',
  templateUrl: 'details-ticket.html',
})
export class DetailsTicketPage {

  detailsTicket:any;
  paniers:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private gCrtl: GateauxServiceProvider,private storage:Storage) {
    this.detailsTicket = this.navParams.get('ticket');
    if(this.detailsTicket!=null)
    {
      let pourcentage = ((this.detailsTicket.montantKollere * 1 * 100) / (this.detailsTicket.prixResto*1))*1;
      this.detailsTicket.reduction = 100 - pourcentage;
      this.detailsTicket.prixResto = this.gCrtl.millier(this.detailsTicket.prixResto);
      this.detailsTicket.montantKollere = this.gCrtl.millier(this.detailsTicket.montantKollere);
      if(this.detailsTicket.type=='hbd')
      {
        this.detailsTicket.prix_livraison = this.gCrtl.millier(this.detailsTicket.prix_livraison);
        this.detailsTicket.total = this.gCrtl.millier(this.detailsTicket.total);

      }
    }
    else{
        this.paniers = this.navParams.get("panier");

    }

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsTicketPage');
  }
  update(i,j){
    console.log(this.paniers.commerces[i].paniers[j]);

   this.paniers.commerces[i].paniers[j].editing=true;

   this.paniers.commerces[i].paniers[j].prixuboutique = (this.paniers.commerces[i].paniers[j].prixrestaurant *1)/(this.paniers.commerces[i].paniers[j].quantite);
   this.paniers.commerces[i].paniers[j].prixukollere = (this.paniers.commerces[i].paniers[j].prixsurkollere *1)/(this.paniers.commerces[i].paniers[j].quantite);
   this.paniers.commerces[i].paniers[j].newquantite =this.paniers.commerces[i].paniers[j].quantite;
  }
  calculate(i,j){
    if(this.paniers.commerces[i].paniers[j].newquantite && this.paniers.commerces[i].paniers[j].newquantite>0)
    {
      this.paniers.commerces[i].paniers[j].erreur = false;
      this.paniers.commerces[i].paniers[j].prixsurkollere =  this.paniers.commerces[i].paniers[j].prixukollere * this.paniers.commerces[i].paniers[j].newquantite;
      this.paniers.commerces[i].paniers[j].prixrestaurant =  this.paniers.commerces[i].paniers[j].prixuboutique * this.paniers.commerces[i].paniers[j].newquantite;
    }
    else{
      this.paniers.commerces[i].paniers[j].erreur = true;

    }

  }
  cancel(i,j){
    this.paniers.commerces[i].paniers[j].editing=null;
    this.paniers.commerces[i].paniers[j].prixsurkollere =  this.paniers.commerces[i].paniers[j].prixukollere * this.paniers.commerces[i].paniers[j].quantite;
    this.paniers.commerces[i].paniers[j].prixrestaurant =  this.paniers.commerces[i].paniers[j].prixuboutique * this.paniers.commerces[i].paniers[j].quantite;
  }
  validateupdate(i,j,type){
    let ticket = this.paniers.codepanier;
    let quantite = type=="suppression"? 0 : this.paniers.commerces[i].paniers[j].newquantite;
    let url = "http://services.ajit.sn/ws/resto/editingpanier?commerce="+encodeURI(this.paniers.commerces[i].commerce);
      url+="&panier="+ticket+"&item="+encodeURI(this.paniers.commerces[i].paniers[j].item) ;
      url+="&quantite="+quantite;
      console.log("url ====>"+url)
      this.gCrtl.afficheloading();
      this.gCrtl.getpost(url).then(data=>{
        this.gCrtl.dismissloadin();
       let val = JSON.parse(data.data);
        console.log(JSON.stringify(val))
        if(val.code=="0"){
          let urlp="http://services.ajit.sn/ws/resto/listpaniertems?codepanier="+ticket;
          this.gCrtl.getpost(urlp).then(rep=>{
          this.gCrtl.dismissloadin();
          let value = JSON.parse(rep.data);
          console.log(JSON.stringify(value));
          if(value.code=="0")
          {
            this.paniers = value;
            if(this.paniers.commerces.length>0)
            this.gCrtl.showToast("Votre ticket est modifié avec succès !!!");
            else {
              this.gCrtl.showToast("Votre panier est desormais vide !!!");
              this.storage.remove("codepanier");
              this.navCtrl.pop();

            }


          }
          else {
            this.gCrtl.showToast("Ce ticket est introuvable");}


          }).catch(err=>{
            this.gCrtl.showToast("Probleme de connexion")
          })


        }

      }).catch(err=>{
        this.gCrtl.dismissloadin();
        console.log(JSON.stringify(err))
      })
  }
  remove(ticket){

    this.storage.get('tickets').then((val) => {
      if (!(val == null)) {
        console.log(JSON.stringify(val));
        let i=0;
        while(i<val.length && val[i].ticket!=ticket)
          i++;
        val.splice(i,1);

        this.storage.set("tickets",val);
       // this.navCtrl.pop(DetailsTicketPage)

      }

    });
  }

}
