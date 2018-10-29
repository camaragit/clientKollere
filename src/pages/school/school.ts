import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GateauxServiceProvider} from "../../providers/gateaux-service/gateaux-service";
import {Storage} from "@ionic/storage";
import {UserpopoverPage} from "../userpopover/userpopover";
import {LoginPage} from "../login/login";
import {SucesscommandePage} from "../sucesscommande/sucesscommande";
import {HomePage} from "../home/home";
import {GloabalVariable} from "../../providers/gateaux-service/GloabalVariable";
import {FamillePage} from "../famille/famille";

/**
 * Generated class for the SchoolPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-school',
  templateUrl: 'school.html',
})
export class SchoolPage {
  ecoles:any=[];
  private client : FormGroup;
  private items:any=[];
  private familles:any=[];
  user:any;
  constructor(public navCtrl: NavController,private gbv:GloabalVariable,private modalCrtl:ModalController,private popoverCtrl:PopoverController,private storage:Storage,public navParams: NavParams,private gCrtl:GateauxServiceProvider,private formBuilder:FormBuilder) {
    this.client = this.formBuilder.group({
      ecole: ['', Validators.required],
      famille: ['', Validators.required],
      item: ['', Validators.required],
      prixboutique: ['', Validators.required],
      prixkollere: ['', Validators.required],

    });
    this.loaduser();

  }
  changementfamille(){
    this.client.controls['item'].setValue('');
    this.gCrtl.afficheloading();
//    console.log("http://services.ajit.sn/ws/resto/listfamillesschool?famille="+encodeURI(this.client.controls['famille'].value));
    this.gCrtl.getpost("http://services.ajit.sn/ws/resto/listitemsfamilleschool?famille="+encodeURI(this.client.controls['famille'].value)).then(reponse=>{
      this.gCrtl.dismissloadin();

      reponse.data = JSON.parse(reponse.data);
      this.items = [];
      for(let i=0;i<reponse.data.length;i++)
      {
        if(reponse.data[i]!=null){
          this.items.push(reponse.data[i])
        }
      }

      console.log(JSON.stringify(reponse.data));
      console.log(JSON.stringify(this.items));
    }).catch(err=>{
      this.gCrtl.dismissloadin();
      this.gCrtl.showToast("Probleme de connexion");
    })
  }
  goback(){
    this.navCtrl.setRoot(HomePage)
  }
  changementecole(){
    this.client.controls['famille'].setValue('');
    this.gCrtl.afficheloading();
   // http://services.ajit.sn/ws/resto/listfamillesschool?commerce=IAM
    this.gCrtl.getpost("http://services.ajit.sn/ws/resto/listfamillesschool?commerce="+encodeURI(this.client.controls['ecole'].value)).then(reponse=>{
      this.gCrtl.dismissloadin();
      reponse.data = JSON.parse(reponse.data);
      console.log(reponse.data)
      this.familles = [];
      let taille = reponse.data.length;
      if(taille>0)
      {
        for(let i=0;i<taille;i++)
        {
          if(reponse.data[i]!=null){
            this.familles.push(reponse.data[i])
          }
        }
      }
      else{
        this.gCrtl.showError("Aucune famille trouvée pour cette école")
      }




    }).catch(err=>{
      this.gCrtl.dismissloadin();
      this.gCrtl.showToast("Probleme de connexion");
    })
  }
  changementproduit(){
    let i=0;
    while(i<this.items.length && this.items[i].item!=this.client.controls['item'].value)
      i++;
    this.client.controls['prixboutique'].setValue(this.items[i].valeurItem.prixResto);
    this.client.controls['prixkollere'].setValue(this.items[i].valeurItem.prixKollere);
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
    console.log("Home mon evenement ==>"+myEvent)
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
     // this.header_data.user = val;
      this.user = val;
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SchoolPage');
    this.gCrtl.afficheloading();
    this.gCrtl.getpost("http://services.ajit.sn/ws/resto/listschool").then(rep=>{
      this.gCrtl.dismissloadin();
      rep.data = JSON.parse(rep.data);
      for(let i=0;i<rep.data.length;i++)
      {
        if(rep.data[i]!=null){
          this.ecoles.push(rep.data[i]);
        }
      }

    }).catch(err=>{
      this.gCrtl.dismissloadin();
      this.gCrtl.showToast("Probleme de connexion");
    })
  }
  verscommande(famille){
    let url = "http://services.ajit.sn/ws/resto/listitemsfamilleschool?famille="+encodeURI(famille)+"&commerce="+encodeURI(this.client.controls["ecole"].value);
    console.log(url);
    this.gCrtl.afficheloading();
    this.gCrtl.getpost(url).then(rep=>{
      this.gCrtl.dismissloadin();
      let val = JSON.parse(rep.data);
      val.famille = famille;
      val.ecole = this.client.controls["ecole"].value;
      this.navCtrl.push(FamillePage,{items:val})

    }).catch(err=>{
      this.gCrtl.dismissloadin();
    })
  }
  sendCommande(){

    let url ="http://services.ajit.sn/ws/resto/gencodeticket?nomcomerce="+encodeURI(this.client.controls['ecole'].value);
    url+= "&item="+encodeURI(this.client.controls['item'].value)+"&prixrestaurant=";
    url+=this.client.controls['prixboutique'].value+"&prixsurkollere="+this.client.controls['prixkollere'].value;

    this.gCrtl.afficheloading();
    this.gCrtl.getpost(url,{},{requetemode:this.gbv.requestmode}).then(data=>{
      this.gCrtl.dismissloadin();
      let val =JSON.parse(data.data);

      if(val.code=="0")
      {
        val.operation="restaurant";
        val.type = this.client.controls['item'].value;
        val.resto = this.client.controls['ecole'].value;
        this.storage.get("user").then(data=>{
          if(data!=null)
          {
            this.gCrtl.getpost("http://services.ajit.sn/ws/common/detailachats?email="+data.username).then(res=>{

            }).catch(err=>{

            })
          }
        })

        this.navCtrl.setRoot(SucesscommandePage,{data:val});
      }

      else this.gCrtl.showError(val.message);
    }).catch(err=>{
      this.gCrtl.dismissloadin();
      this.gCrtl.showToast("Problème de connexion internet");
    })
  }
}
