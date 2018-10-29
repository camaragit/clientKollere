import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {GateauxServiceProvider} from "../../providers/gateaux-service/gateaux-service";
import {DetailsTicketPage} from "../details-ticket/details-ticket";
import {LoginPage} from "../login/login";
import {UserpopoverPage} from "../userpopover/userpopover";
import {PanierPage} from "../panier/panier";
@IonicPage()
@Component({
  selector: 'page-mes-tickets',
  templateUrl: 'mes-tickets.html',
})
export class MesTicketsPage {
tickets :any;
  header_data
  user:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private modalCrtl:ModalController,private popoverCtrl:PopoverController,private storage:Storage,private gCrtl:GateauxServiceProvider) {
    this.header_data={title:"Mes Tickets"};
    this.storage.get('tickets').then((val) => {
      if (!(val == null)) {
        //console.log(JSON.stringify(val));
        for(let i=0;i<val.length;i++)
        {
          if(!val[i].newtype){
            val.splice(i,1);
          }
        }
        this.tickets = val;
        if(val.length<=0) this.gCrtl.showToast("Pas de ticket !!!");
        this.storage.set("tickets",this.tickets);
        console.log("MEs tickets"+JSON.stringify(this.tickets))

      }
      else{this.gCrtl.showToast("Pas de ticket !!!")}
    });
this.loaduser();
  }

  pending(){
    // this.gCrtl.showToast("En cours de developpement")
    let mod= this.modalCrtl.create(LoginPage);
    mod.present();
    mod.onDidDismiss(d=>{
      this.loaduser();
    })
  }
  useroptions(myEvent){
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

    })
  }
  detailsTicket(ticket,type){
    if(ticket.ticket)
    {
      this.gCrtl.afficheloading();
      this.gCrtl.getpost("http://services.ajit.sn/ws/resto/infoticket?ticket="+encodeURI(ticket.ticket)).then(data=>{
        this.gCrtl.dismissloadin();
        data = JSON.parse(data.data);
        if(data.code=="0"){
          data.ticket = ticket.ticket;
          data.type =type;
          data.montantKollere = data.montantKollere *1;
          data.total = data.prix_livraison*1 + data.montantKollere*1;
          this.navCtrl.push(DetailsTicketPage,{'ticket':data});
        }
        else {
          this.remove(ticket.ticket,'ticket');

        }

      }).catch(err=>{
        this.gCrtl.dismissloadin();
        this.gCrtl.showToast("Probleme de connexion internet")


      })
    }
    else{
      let urlp="http://services.ajit.sn/ws/resto/listpaniertems?codepanier="+ticket.codepanier;
      //   console.log("url========>"+urlp)
      this.gCrtl.afficheloading();
      this.gCrtl.getpost(urlp).then(data=>{
        this.gCrtl.dismissloadin();
        let val = JSON.parse(data.data);
        console.log(JSON.stringify(val));
        if(val.code=="0")
        {
          if(val.commerces.length>0)
          {
            this.navCtrl.push(DetailsTicketPage,{panier:val});

          }
          else this.remove(ticket.codepanier,"codepanier");

        }
        else {

          this.remove(ticket.codepanier,"codepanier");
        }


      }).catch(err=>{
        this.gCrtl.dismissloadin();
        this.gCrtl.showToast("Probleme de connexion")
      })

    }

  }
  remove(ticket,type){
    this.gCrtl.showToast("Ce ticket est introuvable");
    this.storage.get('tickets').then((val) => {
      console.log("tickes===>"+val);
      if (!(val == null)) {
        console.log(JSON.stringify(val));
        let i=0;
        if(type=="codepanier"){
          while(i<val.length && val[i].codepanier!=ticket) i++;
        }
        else{
          while(i<val.length && val[i].ticket!=ticket) i++;
        }


        val.splice(i,1);
        this.tickets = val;
        this.storage.set("tickets",this.tickets);

      }

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MesTicketsPage');
  }

}
