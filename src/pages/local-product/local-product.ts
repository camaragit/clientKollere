import { Component } from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {WheelSelector} from "@ionic-native/wheel-selector";
import {GateauxServiceProvider} from "../../providers/gateaux-service/gateaux-service";
import {SucesscommandePage} from "../sucesscommande/sucesscommande";
import {HomePage} from "../home/home";
import {Storage} from "@ionic/storage";
import {LoginPage} from "../login/login";
import {UserpopoverPage} from "../userpopover/userpopover";
import {GloabalVariable} from "../../providers/gateaux-service/GloabalVariable";
import {PanierPage} from "../panier/panier";
import {SchoolPage} from "../school/school";
import {RestaurantPage} from "../restaurant/restaurant";

/**
 * Generated class for the ClientPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-client',
  templateUrl: 'local-product.html',
})
export class LocalProductPage {
  private client : FormGroup;
  private resto;
  localdata :any=[];
  private adresses;
  private globalData :any ={};
  private tariflivraison;
  private dataclient:any;
  private phoneinvalid :boolean = false;
  minDate :any;
  header_data:any;
  user:any=null;


  constructor(public navCtrl: NavController,private alertCtrl:AlertController,private gbv:GloabalVariable,private modalCrtl:ModalController,private popoverCtrl:PopoverController, private storage:Storage,public navParams: NavParams,private selector: WheelSelector,private formBuilder: FormBuilder,private gCtrl:GateauxServiceProvider) {
    let date = new Date();
    this.loaduser();
    this.header_data={title:"Complément Commande"};
    let datesuivant =date.setDate(date.getDate());
    this.minDate = new Date(datesuivant).toISOString();
    this.client = this.formBuilder.group({
      type: ['', Validators.required],
      nom: ['', Validators.required],
      resto: ['', Validators.required],
      quantite: ['', Validators.required],
      prenom: ['',Validators.required],
      adresse: ['',Validators.required],
      phone: ['',Validators.required],
      datelivraison: ['',Validators.required],
      prixboutique: [''],
      prixkollere: [''],
      reduction: ['']
    });
    this.globalData = this.navParams.get('data');
    this.client.controls['type'].setValue(this.globalData);
    this.gCtrl.afficheloading();
    //prix item par resto
    this.gCtrl.getpost("http://services.ajit.sn/ws/resto/tarifsrestoitem?item="+encodeURI(this.globalData)+"&pin=0000&commerce=commerce").then(data=>{
      this.gCtrl.dismissloadin();
      // = JSON.parse(data.data).restoParts;
      console.log(JSON.parse(data.data));
      data.data = JSON.parse(data.data);
      let tab =[];
      for(let i=0;i<data.data.length;i++)
      {
        if(data.data[i].item!=""){
          tab.push(data.data[i])
        }
      }
      this.resto = tab;
      console.log("RESTOS+++++++"+JSON.stringify(this.resto));
      })
    .catch(err=>{
        this.gCtrl.dismissloadin();
        this.gCtrl.showToast("Probleme de connexion internet");
      })



  }
  getTarif(){
    console.log(this.client.controls['adresse'].value);
    console.log(this.adresses);
    let i =0;
    while(i<this.adresses.livraison.length && this.adresses.livraison[i].adresse!=this.client.controls['adresse'].value)
      i++;
    this.tariflivraison = this.adresses.livraison[i].livraisonKollere;

  }
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

        //Si le user est deja connecté
        if(this.user!=null)
        {
          this.client.controls['nom'].setValue(this.user.nom);
          this.client.controls['prenom'].setValue(this.user.prenom);
          this.client.controls['phone'].setValue(this.user.telephone);
        }
      }
      else           this.gCtrl.showToast(val.message);

    }).catch(err=>{
      this.gCtrl.showToast("Probleme de connexion internet");
    })
  }
  changementrestaurant(){
    this.client.controls['quantite'].setValue(1);
    let i=0;
    while(i<this.resto.length && this.resto[i].commerce!=this.client.controls['resto'].value)
      i++;

    this.client.controls['prixboutique'].setValue(this.resto[i].valeurItem.prixResto*this.client.controls['quantite'].value);
    this.client.controls['prixkollere'].setValue(this.resto[i].valeurItem.prixKollere*this.client.controls['quantite'].value);
    let pourcentage = ((this.client.controls['prixkollere'].value*1) * 100 / (this.client.controls['prixboutique'].value*1))*1;
    // console.log("POURCENTAGE VAUT =====>"+pourcentage)
    this.client.controls['reduction'].setValue(100 - pourcentage*1 );
    this.avecLivraison();

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
      // this.header_data.user = val;
      this.user = val;
      if(this.user!=null)
      {
        this.client.controls['nom'].setValue(this.user.nom);
        this.client.controls['prenom'].setValue(this.user.prenom);
        this.client.controls['phone'].setValue(this.user.telephone);
      }

    })
  }
  resetphone(){
    this.phoneinvalid = false;
  }
  changementquantite(){
    let i =0;

    while(this.resto[i].commerce!==this.client.controls['resto'].value)
      i++;
    console.log(this.resto[i].commerce)
    console.log(this.resto[i])
    this.client.controls["prixboutique"].setValue(this.resto[i].valeurItem.prixResto*this.client.controls['quantite'].value);
    this.client.controls["prixkollere"].setValue(this.resto[i].valeurItem.prixKollere*this.client.controls['quantite'].value);
    let pourcentage = ((this.client.controls['prixkollere'].value*1) * 100 / (this.client.controls['prixboutique'].value*1))*1;
    // console.log("POURCENTAGE VAUT =====>"+pourcentage)
    this.client.controls['reduction'].setValue(100 - pourcentage*1 );

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ClientPage');


  }

  formaterdate(date){
    return date.substr(8,2)+"-"+date.substr(5,2)+"-"+date.substr(0,4);

  }
  veriftel()
  {
    let suffix =  this.client.controls['phone'].value.substring(0,2);
    let tabsuffix =['77','70','76','78'];
    this.phoneinvalid = (tabsuffix.indexOf(suffix)===-1 || this.client.controls['phone'].value.length!==9)  ? true :false;

  }
  goback(){
    this.navCtrl.setRoot(HomePage)
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
  sendCommanderesto(){
    this.storage.get("codepanier").then(data=>{
      let codepanier = data!=null?data:0;
      let url = "http://services.ajit.sn/ws/resto/loadingpanier?commerce="+encodeURI(this.client.controls['resto'].value);
      url+="&panier="+codepanier+"&item="+encodeURI(this.globalData);
      url+="&prixresto="+this.client.controls['prixboutique'].value+"&prixkollere="+this.client.controls['prixkollere'].value;
      url+="&quantite="+this.client.controls['quantite'].value;
      let datliv = this.formaterdate(this.client.controls['datelivraison'].value);
      url+= "&prenom="+encodeURI(this.client.controls['prenom'].value)+"&nom="+encodeURI(this.client.controls['nom'].value)+"&telephone="+encodeURI(this.client.controls['phone'].value);
      url+= "&adresse="+encodeURI(this.client.controls['adresse'].value)+"&dateLivraison="+encodeURI(datliv);
       console.log(url);
      this.gCtrl.afficheloading();
      this.gCtrl.getpost(url,{},{requetemode:this.gbv.requestmode}).then(reponse=>{
        this.gCtrl.dismissloadin();
        reponse =JSON.parse(reponse.data);
        if(reponse.code=="0"){
          let ticketpanier= reponse.codepanier;
          if(this.user!=null)
          {
            this.gCtrl.getpost("http://services.ajit.sn/ws/resto/fideliseticket?ticket="+ticketpanier+"&email="+this.user.username)
              .then(res=>{

              }).catch(err=>{

            })
          }
          this.sauvegardepanier(reponse);
          this.storage.set("codepanier",reponse.panierid).then(d=>{
            // console.log(JSON.stringify(d))
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
                    /*    if(this.dataclient.ischool){
                          this.navCtrl.setRoot(SchoolPage);
                        } else{
                          this.navCtrl.setRoot(RestaurantPage);
                        }*/


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
