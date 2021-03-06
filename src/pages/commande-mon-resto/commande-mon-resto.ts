import { Component } from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {GateauxServiceProvider} from "../../providers/gateaux-service/gateaux-service";
import {UserpopoverPage} from "../userpopover/userpopover";
import {LoginPage} from "../login/login";
import {Storage} from "@ionic/storage";
import {PanierPage} from "../panier/panier";
import {GloabalVariable} from "../../providers/gateaux-service/GloabalVariable";
import {HomePage} from "../home/home";

/**
 * Generated class for the CommandeMonRestoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-commande-mon-resto',
  templateUrl: 'commande-mon-resto.html',
})
export class CommandeMonRestoPage {
   client : FormGroup;
   tariflivraison:any;
   tarif :any;
  user:any=null;
  famille:any
  item:any;
  adresses:any
  localdata :any=[];
  aveclivraison:boolean=false;
  prixboutiqueUnit:any;
  prixkollereUnit:any;
  constructor(private gbv:GloabalVariable,private alertCtrl:AlertController,private modalCrtl:ModalController,private popoverCtrl:PopoverController,private storage:Storage, private gCtrl:GateauxServiceProvider,public navCtrl: NavController, public navParams: NavParams,private formBuilder:FormBuilder) {
    this.client = this.formBuilder.group({
      resto: ['', Validators.required],
      quantite: ['', Validators.required],
      prixboutique: [''],
      prixkollere: [''],
      reduction: ['']
   });
    this.loaduser();
    this.tarif = this.navParams.get('tarif')
    this.prixboutiqueUnit = this.tarif[0].valeurItem.prixResto;
    this.prixkollereUnit = this.tarif[0].valeurItem.prixKollere;
    this.client.controls['resto'].setValue(this.navParams.get('resto'));
    this.client.controls['quantite'].setValue(1)
    this.client.controls['prixboutique'].setValue(this.prixboutiqueUnit);
    this.client.controls['prixkollere'].setValue(this.prixkollereUnit);
    let pourcentage = ((this.client.controls['prixkollere'].value*1) * 100 / (this.client.controls['prixboutique'].value*1))*1;
    // console.log("POURCENTAGE VAUT =====>"+pourcentage)
    this.client.controls['reduction'].setValue(Math.ceil(100 - pourcentage*1) );
    this.famille = this.navParams.get('famille');
    this.item = this.navParams.get('item');

    if(this.tarif[0].livraison=="OPTIONNELLE")
    {
      console.log("LIVRAISON OPTIONNELLE")
     this.aveclivraison = false;

      let alert =this.alertCtrl.create({
        title: 'Livraison',
        message:"Souhaitez-vous vous faire livrer  "+this.item+" ?",

        buttons: [
          {
            text: 'Non',
            role: 'cancel',
            handler: () => {

            }
          },
          {
            text: 'Oui',
            handler: () => {
              this.avecLivraison();

            }
          }
        ]
      });
      alert.present();
    }
    else this.avecLivraison();
  }
  changementquantite(){

    this.client.controls["prixboutique"].setValue( this.prixboutiqueUnit*this.client.controls['quantite'].value);
    this.client.controls["prixkollere"].setValue(this.prixkollereUnit*this.client.controls['quantite'].value);
    let pourcentage = ((this.client.controls['prixkollere'].value*1) * 100 / (this.client.controls['prixboutique'].value*1))*1;
    // console.log("POURCENTAGE VAUT =====>"+pourcentage)
    this.client.controls['reduction'].setValue(Math.ceil(100 - pourcentage*1) );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommandeMonRestoPage');
  }
  getTarif(){
    console.log(this.client.controls['adresse'].value);
    console.log(this.adresses);
    let i =0;
    while(i<this.adresses.livraison.length && this.adresses.livraison[i].adresse!=this.client.controls['adresse'].value)
      i++;
    this.tariflivraison = this.adresses.livraison[i].livraisonKollere;

  }
  //Si livraison
  avecLivraison(){
    console.log("Chez moi la livraison est obligatoire")
    this.gCtrl.getpost("http://services.ajit.sn/ws/resto/tariflivraisongateaux?commerce="+encodeURI(this.client.controls['resto'].value)).
    then(data=>{
      console.log(JSON.stringify(JSON.parse(data.data)));
      let val = JSON.parse(data.data);
      if(val.code && val.code==="0" )
      {
        console.log(val);
        this.adresses= val;
        //Ajout de champs supplementaires pour la livraison
        this.aveclivraison = true;
        this.client.addControl("nom",new FormControl('',Validators.required));
        this.client.addControl("prenom",new FormControl('',Validators.required));
        this.client.addControl("adresse",new FormControl('',Validators.required));
        this.client.addControl("phone",new FormControl('',Validators.required));
        this.client.addControl("datelivraison",new FormControl('',Validators.required));
        //Si le user est deja connecté
        if(this.user!=null)
        {
          this.client.controls['nom'].setValue(this.user.nom);
          this.client.controls['prenom'].setValue(this.user.prenom);
          this.client.controls['phone'].setValue(this.user.telephone);
        }
      }
      else this.gCtrl.showError(val.message);

    }).catch(err=>{
      this.gCtrl.showToast("Probleme de connexion internet");
    })
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
      console.log("utilisateur "+JSON.stringify(val));
      this.user = val;
      if(this.user!=null )
      {
        this.client.addControl("nom",new FormControl('',Validators.required));
        this.client.addControl("prenom",new FormControl('',Validators.required));
        this.client.addControl("phone",new FormControl('',Validators.required));
        console.log("Avant les set nom,prenom,telephone")
        this.client.controls['nom'].setValue(this.user.nom);
        this.client.controls['prenom'].setValue(this.user.prenom);
        this.client.controls['phone'].setValue(this.user.telephone);
        console.log("Apres les set nom,prenom,telephone")

      }

    })
  }
  formaterdate(date){
    return date.substr(8,2)+"-"+date.substr(5,2)+"-"+date.substr(0,4);

  }
  goback(){
    this.navCtrl.setRoot(HomePage);
  }
  sendCommanderesto(){
    if(this.user==null)
    {
      this.pending();
    }
    else{
      console.log('Commande resto')
      this.storage.get("codepanier").then(data=>{
        let codepanier = data!=null?data:0;
        let url = "http://services.ajit.sn/ws/resto/loadingpanier?commerce="+encodeURI(this.client.controls['resto'].value);
        url+="&panier="+codepanier+"&item="+encodeURI(this.item);
        url+="&prixresto="+this.client.controls['prixboutique'].value+"&prixkollere="+this.client.controls['prixkollere'].value;
        url+="&quantite="+this.client.controls['quantite'].value+"&numtel="+this.user.telephone;
        if(this.aveclivraison==true)
        {
          let datliv = this.formaterdate(this.client.controls['datelivraison'].value);
          url+= "&prenom="+encodeURI(this.client.controls['prenom'].value)+"&nom="+encodeURI(this.client.controls['nom'].value)+"&telephone="+encodeURI(this.client.controls['phone'].value);
          url+= "&adresse="+encodeURI(this.client.controls['adresse'].value)+"&dateLivraison="+encodeURI(datliv);
        }
        else {
          url+= "&prenom=prenom&nom=nom&telephone=telephone&adresse=adresse&dateLivraison=dateLivraison";
        }
        console.log(url);
        this.gCtrl.afficheloading();
        this.gCtrl.getpost(url,{},{requetemode:this.gbv.requestmode}).then(reponse=>{
          this.gCtrl.dismissloadin();
          reponse =JSON.parse(reponse.data);
          if(reponse.code=="0"){
            let ticketpanier= reponse.codepanier;
            if(this.aveclivraison==true)
            {
              this.gCtrl.sendsms(this.user.telephone,ticketpanier,this.client.controls['adresse'].value,this.tariflivraison);

            }
            if(this.user!=null)
            {
              this.gCtrl.getpost("http://services.ajit.sn/ws/resto/fideliseticket?ticket="+ticketpanier+"&email="+this.user.username)
                .then(res=>{

                }).catch(err=>{

              })
            }

            this.sauvegardepanier(reponse);
            this.storage.set("codepanier",reponse.panierid).then(d=>{
              let alert =this.alertCtrl.create({
                title: 'Commande enregistrée',
                message:"Désirez-vous commander autre chose?",

                buttons: [
                  {
                    text: 'Non',
                    role: 'cancel',
                    handler: () => {
                      let urlp="http://services.ajit.sn/ws/resto/listpaniertems?codepanier="+ticketpanier;
                      //   console.log("url========>"+urlp)
                      this.gCtrl.afficheloading();
                      this.gCtrl.getpost(urlp).then(data=>{
                        this.gCtrl.dismissloadin();
                        let val = JSON.parse(data.data);
                        console.log(JSON.stringify(val));
                        if(val.code=="0")
                        {
                          val.operation ="restaurant";
                          val.newtype ="restaurant";
                          this.navCtrl.setRoot(PanierPage,{panier:val});
                        }

                        else this.gCtrl.showError(val.message)
                      }).catch(err=>{
                        this.gCtrl.dismissloadin();
                        this.gCtrl.showToast("Probleme de connexion")
                      })
                      //  console.log('Cancel clicked');
                    }
                  },
                  {
                    text: 'Oui',
                    handler: () => {
                      this.navCtrl.pop();

                    }
                  }
                ]
              });
              alert.present();

            }).catch(err=>{
              alert(JSON.stringify(err));

            })

          }else this.gCtrl.showError(reponse.message)
        })

      }).catch(err=>{
        this.gCtrl.dismissloadin();
        console.log(JSON.stringify(err));
        this.gCtrl.showToast("Problème de connexion internet");
      })
    }



  }
  sauvegardepanier(reponse){
    //sauvegarde ticket panier
    reponse.newtype ="restaurant";
    reponse.operation ="restaurant";
    console.log("sauvegarde =====>"+JSON.stringify(reponse))
    this.storage.get('tickets').then((val) => {
      if (!(val == null)) {
        console.log("ticket local "+JSON.stringify(val))
        let i=0;
        while(i<val.length){
          if(val[i].codepanier && val[i].codepanier == reponse.codepanier)
            break;
          i++;

        }

        if(i==val.length)
        {
          val[i] = reponse;
          this.storage.set('tickets',val).then(data=>{
            console.log("ajout")
            //console.log(data)
          })
        }
      }
      else {
        this.localdata[0] = reponse;
        this.storage.set('tickets', this.localdata).then(val=>{
          console.log("premier ")
          // console.log(val)
        })
      }
    })
  }
}
