import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {GateauxServiceProvider} from "../../providers/gateaux-service/gateaux-service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HomePage} from "../home/home";
import {SucesscommandePage} from "../sucesscommande/sucesscommande";
import {Storage} from "@ionic/storage";
import {UserpopoverPage} from "../userpopover/userpopover";
import {LoginPage} from "../login/login";
import {ClientPage} from "../client/client";
import {FamillePage} from "../famille/famille";

/**
 * Generated class for the RestaurantPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-restaurant',
  templateUrl: 'restaurant.html',
})
export class RestaurantPage {
  familles:any=[];
  private client : FormGroup;
  private items:any=[];
  private restos:any=[];
  user:any;
  svg: any ;
  isOn:boolean=false;
  constructor(public navCtrl: NavController,private modalCrtl:ModalController,private popoverCtrl:PopoverController,private storage:Storage,public navParams: NavParams,private gCrtl:GateauxServiceProvider,private formBuilder:FormBuilder) {
    this.client = this.formBuilder.group({
      famille: ['', Validators.required],
      item: ['', Validators.required],
      resto: ['', Validators.required],
      prixboutique: ['', Validators.required],
      prixkollere: ['', Validators.required],


    });
    this.loaduser();
    this.gCrtl.afficheloading();
    this.gCrtl.getpost("http://services.ajit.sn/ws/resto/listfamilles").then(rep=>{
      this.gCrtl.dismissloadin();
      rep.data = JSON.parse(rep.data);
      for(let i=0;i<rep.data.length;i++)
      {
        if(rep.data[i]!=null){
          //rep.data[i].image = "assets/imgs/"+rep.data[i]+".jpg";
          this.familles.push(rep.data[i]);
        }
      }
      this.svg=this.familles;

    }).catch(err=>{

      this.gCrtl.dismissloadin();
      this.gCrtl.showToast("Probleme de connexion");
    })
  }
  filterfamille(ev: any) {
    this.familles =this.svg;
    let serVal = ev.target.value;
    if (serVal && serVal.trim() != '') {
      this.familles = this.familles.filter((montab) => {
        return (montab.toLowerCase().indexOf(serVal.toLowerCase()) >= 0 );
      })
    }
  }
  toggleRecherche() {
    this.isOn = !this.isOn;
  }
  changementfamille(){
    this.client.controls['item'].setValue('');
      this.gCrtl.afficheloading();
      this.gCrtl.getpost("http://services.ajit.sn/ws/resto/listitemsfamille?famille="+encodeURI(this.client.controls['famille'].value)).then(reponse=>{
      this.gCrtl.dismissloadin();

      this.items = JSON.parse(reponse.data);

    }).catch(err=>{
      this.gCrtl.dismissloadin();
      this.gCrtl.showToast("Probleme de connexion");
    })
  }

  goback(){
    this.navCtrl.setRoot(HomePage)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RestaurantPage');
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
  verscommande(item){
    this.navCtrl.push(FamillePage,{famille:item});
  }
  loaduser(){
    this.storage.get("user").then(val=>{
     // this.header_data.user = val;
      this.user = val;

    })
  }
}
