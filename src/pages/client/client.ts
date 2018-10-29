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

/**
 * Generated class for the ClientPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-client',
  templateUrl: 'client.html',
})
export class ClientPage {
  private client : FormGroup;
  private resto;
  localdata :any=[];
  private adresses;
  private globalData :any ={};
  private tariflivraison;
  private dataclient:any=null;
  private aveclivraison :boolean=false;
  private phoneinvalid :boolean = false;
  minDate :any;
  header_data:any;
  user:any=null;
  tabpart : Array<{description: string}>=[];
  tab =[
    {description: '0'},
    {description: '1'},
    {description: '2'},
    {description: '3'},
    {description: '4'},
    {description: '5'},
    {description: '7'},
    {description: '8'},
    {description: '9'},
    {description: '10'},
    {description: '11'},
    {description: '12'}];

  constructor(public navCtrl: NavController,private alertCtrl:AlertController,private gbv:GloabalVariable,private modalCrtl:ModalController,private popoverCtrl:PopoverController, private storage:Storage,public navParams: NavParams,private selector: WheelSelector,private formBuilder: FormBuilder,private gCtrl:GateauxServiceProvider) {


   this.header_data={title:"Complément Commande"};

    this.client = this.formBuilder.group({
      type: ['', Validators.required],
      nom: ['', Validators.required],
      resto: ['', Validators.required],
      nbpart: ['', Validators.required],
      prenom: ['',Validators.required],
      adresse: ['',Validators.required],
      phone: ['',Validators.required],
      datelivraison: ['',Validators.required],
      nbbougie: ['0'],
      prixboutique: [''],
      prixkollere: [''],
      reduction: [''],
      texte: [''],
      gateauid: ['']
    });
    this.globalData = this.navParams.get('data');
    //gateaux anniv
    if(this.globalData!=null){
      let date = new Date();
      let datesuivant = date.setDate(date.getDate()+1);
      this.minDate = new Date(datesuivant).toISOString();
      this.client.controls['type'].setValue(this.globalData);
      this.gCtrl.afficheloading();
      this.gCtrl.getpost("http://services.ajit.sn/ws/resto/partscommercesgateaux?type="+encodeURI(this.globalData)).then(data=>{
        this.gCtrl.dismissloadin();
        this.resto = JSON.parse(data.data).restoParts;
        console.log(JSON.parse(data.data));
      }).catch(err=>{
        this.gCtrl.dismissloadin();
        this.gCtrl.showToast("Probleme de connexion internet");
      })
    }
    else{
      var date = new Date();
      let datesuivant = date.setDate(date.getDate());
      this.minDate = new Date(datesuivant).toISOString();
        //resto
      this.dataclient = this.navParams.get('restos');
      this.client.addControl("quantite",new FormControl('',Validators.required));
      this.client.removeControl("nbpart");
      this.client.removeControl("type");
      this.client.removeControl("datelivraison");
      this.client.removeControl("nom");
      this.client.removeControl("prenom");
      this.client.removeControl("adresse");

      console.log("restaurant  "+JSON.stringify(this.dataclient));

      //kollere school
      if(this.dataclient==null)
      {
        console.log("kollere school");
        this.client = this.formBuilder.group({
          prixboutique: [''],
          prixkollere: [''],
          reduction: [''],
          resto:['',Validators.required],
          quantite:['',Validators.required]
        });
        this.dataclient = this.navParams.get('itemschool');
        this.dataclient.ischool = true;
        this.client.controls["resto"].setValue(this.dataclient.ecole);
        this.client.controls['quantite'].setValue(1);
        this.changementrestaurant();
      }
      console.log(this.dataclient);

    }
    this.loaduser();

  }
  getTarif(){
    console.log(this.client.controls['adresse'].value);
    console.log(this.adresses);
    let i =0;
    while(i<this.adresses.livraison.length && this.adresses.livraison[i].adresse!=this.client.controls['adresse'].value)
      i++;
    this.tariflivraison = this.adresses.livraison[i].livraisonKollere;

  }
   changementrestaurant(){
   console.log("il y'a changement de quantite")
     //Restaurant normal
    if(!this.dataclient.ischool)
    {

      let i=0;
      while(i<this.dataclient.restos.length && this.dataclient.restos[i].commerce!=this.client.controls['resto'].value)
        i++;
      console.log(JSON.stringify(this.dataclient.restos[i]))
      if(this.dataclient.restos[i].livraison=="OBLIGATOIRE")
      {
        this.avecLivraison();

      }
      else{
        console.log("LIVRAISON OPTIONNELLE")
       // this.client.removeControl();
        this.aveclivraison = false;
        this.client.removeControl("nom");
        this.client.removeControl("prenom");
        this.client.removeControl("adresse");
        this.client.removeControl("phone");
        let alert =this.alertCtrl.create({
          title: 'Livraison',
          message:"Souhaitez-vous vous faire livrer ?",

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
      console.log("Avec livraison "+this.aveclivraison);

      this.client.controls['prixboutique'].setValue(this.dataclient.restos[i].valeurItem.prixResto*this.client.controls['quantite'].value);
      this.client.controls['prixkollere'].setValue(this.dataclient.restos[i].valeurItem.prixKollere*this.client.controls['quantite'].value);
      let pourcentage = ((this.client.controls['prixkollere'].value*1) * 100 / (this.client.controls['prixboutique'].value*1))*1;
      // console.log("POURCENTAGE VAUT =====>"+pourcentage)
      this.client.controls['reduction'].setValue(Math.ceil(100 - pourcentage*1) );

    }
    //Kollere school
    else{

      this.client.controls["prixboutique"].setValue(this.dataclient.valeurItem.prixResto*this.client.controls['quantite'].value);
      this.client.controls["prixkollere"].setValue(this.dataclient.valeurItem.prixKollere*this.client.controls['quantite'].value);
      let pourcentage = ((this.client.controls['prixkollere'].value*1) * 100 / (this.client.controls['prixboutique'].value*1))*1;
     // console.log("POURCENTAGE VAUT =====>"+pourcentage)
      this.client.controls['reduction'].setValue(Math.ceil(100 - pourcentage*1) );

    }

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
      else           this.gCtrl.showToast(val.message);

    }).catch(err=>{
      this.gCtrl.showToast("Probleme de connexion internet");
    })
  }
  changementquantite(){

    //Les restaurant
    if(!this.dataclient.ischool)
    {
      let i =0;

      while(this.dataclient.restos[i].commerce!==this.client.controls['resto'].value)
        i++;
     // alert(JSON.stringify(this.resto[i].commerce));
     // alert(JSON.stringify(this.resto[i]))
      //console.log(this.resto[i])
      this.client.controls["prixboutique"].setValue(this.dataclient.restos[i].valeurItem.prixResto*this.client.controls['quantite'].value);
      this.client.controls["prixkollere"].setValue(this.dataclient.restos[i].valeurItem.prixKollere*this.client.controls['quantite'].value);
      let pourcentage = ((this.client.controls['prixkollere'].value*1) * 100 / (this.client.controls['prixboutique'].value*1))*1;
      // console.log("POURCENTAGE VAUT =====>"+pourcentage)
      this.client.controls['reduction'].setValue(Math.ceil(100 - pourcentage*1) );
    }
    //school
    else{

      this.client.controls["prixboutique"].setValue(this.dataclient.valeurItem.prixResto*this.client.controls['quantite'].value);
      this.client.controls["prixkollere"].setValue(this.dataclient.valeurItem.prixKollere*this.client.controls['quantite'].value);
      let pourcentage = ((this.client.controls['prixkollere'].value*1) * 100 / (this.client.controls['prixboutique'].value*1))*1;
      this.client.controls['reduction'].setValue(Math.ceil(100 - pourcentage*1) );
    }


  }
  changementresto(){
    //gateaux d'anniversaire
    if(this.globalData!=null){

      console.log('DAME =====>'+this.client.controls['resto'].value);
      // this.gateaux.nbpart=null;
      this.client.controls['nbpart'].setValue(null);
      let i =0;

      while(this.resto[i].commerce!==this.client.controls['resto'].value)
        i++;
      console.log(this.resto[i].commerce)

      this.tabpart =[];
      for(let j=0;j<this.resto[i].parts.length;j++)
      {
        let data = {'description':this.resto[i].parts[j]}
        this.tabpart.push(data);
      }
      this.gCtrl.getpost("http://services.ajit.sn/ws/resto/tariflivraisongateaux?commerce="+encodeURI(this.client.controls['resto'].value)).
      then(data=>{
        let val = JSON.parse(data.data);
        if(val.code && val.code==="0" )
        {
         // console.log(val);
          this.adresses= val;
        }
      }).catch(err=>{
        this.gCtrl.showToast("Probleme de connexion internet");
      })

    }
    else {
      this.client.controls['quantite'].setValue(1);
      this.changementrestaurant();
    }



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
      if(this.user!=null )
      {
        console.log("Avant les set nom,prenom,telephone")
        this.client.controls['nom'].setValue(this.user.nom);
        this.client.controls['prenom'].setValue(this.user.prenom);
        this.client.controls['phone'].setValue(this.user.telephone);
        console.log("Apres les set nom,prenom,telephone")

      }

    })
  }
  ouvrirnbpart(type){

    this.selector.show({
      title: "Selectionner le nombre de parts",
      negativeButtonText:"Quitter",
      positiveButtonText :"Choisir",
      items: [
        this.tabpart
      ],
    }).then(
      result => {
        this.client.controls['nbpart'].setValue(result[0].description);
        //this.client.nbpart = result[0].description;
        this.gCtrl.afficheloading();
       this.gCtrl.getpost("http://services.ajit.sn/ws/resto/listgateauxresto?commerce="+encodeURI(this.client.controls['resto'].value)+"&type="+encodeURI(type)+"&part="+result[0].description).
         then(data=>{
           this.gCtrl.dismissloadin();
           let val= JSON.parse(data.data);
           this.client.controls['prixboutique'].setValue(val[0].valeurGateau.prixResto);
           this.client.controls['prixkollere'].setValue(val[0].valeurGateau.prixKollere);
           let pourcentage = (this.client.controls['prixkollere'].value *1) * 100 / (this.client.controls['prixboutique'].value *1);
           console.log("Pourcentage ====>"+pourcentage);
         this.client.controls['reduction'].setValue(Math.ceil(100 - pourcentage*1));
         this.client.controls['gateauid'].setValue(val[0].gateau);
        console.log(JSON.parse(data.data));
       }).catch(err=>{
         this.gCtrl.dismissloadin();
         this.gCtrl.showToast("Probleme de connexion internet");

       })
      },
      err => console.log('Error: ', err)
    );
  }
  ouvrirnbbougie(){
    this.selector.show({
      title: "Selectionner le nombre de bougies",
      negativeButtonText:"Quitter",
      positiveButtonText :"Choisir",
      items: [
        this.tab
      ],
    }).then(
      result => {
        //alert(JSON.stringify(result));
        this.client.controls['nbbougie'].setValue(result[0].description);
      },
      err => console.log('Error: ', err)
    );
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
  resetphone(){
    this.phoneinvalid = false;
  }
  goback(){
    this.navCtrl.setRoot(HomePage)
  }
  sendCommande(){
    if(this.user==null)
    {
      this.pending();
    }
    else{
      let datliv = this.formaterdate(this.client.controls['datelivraison'].value);

      let url ="http://services.ajit.sn/ws/resto/gencodegateau?gateau="+this.client.controls['gateauid'].value+"&prenom="+encodeURI(this.client.controls['prenom'].value);
      url+="&nom="+encodeURI(this.client.controls['nom'].value)+"&telephone="+encodeURI(this.client.controls['phone'].value)+"&adresse="+encodeURI(this.client.controls['adresse'].value);
      url+="&bougie="+this.client.controls['nbbougie'].value+"&message="+encodeURI(this.client.controls['texte'].value)+"&date="+encodeURI(datliv)+"&numtel="+this.user.telephone;
      this.gCtrl.afficheloading();
      this.gCtrl.getpost(url,{},{requetemode:this.gbv.requestmode}).then(data=>{
        this.gCtrl.dismissloadin();
        let val =JSON.parse(data.data);
        if(val.code=="0")
        {
          val.operation="hbd";
          val.type = this.globalData;
          val.newtype = "hbd";
          val.resto = this.client.controls['resto'].value;

          if(this.user!=null)
          {
            this.gCtrl.getpost("http://services.ajit.sn/ws/resto/fideliseticket?ticket="+val.ticket+"&email="+this.user.username)
              .then(res=>{

              }).catch(err=>{

            })
          }
          this.navCtrl.setRoot(SucesscommandePage,{data:val});
        }

        else this.gCtrl.showError(val.message);
      }).catch(err=>{
        this.gCtrl.dismissloadin();
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
  sendCommanderesto(){
    if(this.user==null){
      this.pending();
    }
    else{
      this.storage.get("codepanier").then(data=>{
        let codepanier = data!=null?data:0;
        let url = "http://services.ajit.sn/ws/resto/loadingpanier?commerce="+encodeURI(this.client.controls['resto'].value);
        url+="&panier="+codepanier+"&item="+encodeURI(this.dataclient.item);
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
      /*    let url ="http://services.ajit.sn/ws/resto/gencodeticket?nomcomerce="+encodeURI(this.client.controls['resto'].value);
          url+= "&item="+encodeURI(this.dataclient.item)+"&prixrestaurant=";
          url+=this.client.controls['prixboutique'].value+"&prixsurkollere="+this.client.controls['prixkollere'].value;
          this.gCtrl.afficheloading();
          console.log(this.gbv.requestmode);
          console.log(url);
          this.gCtrl.getpost(url,{},{requete:this.gbv.requestmode}).then(reponse=>{
            this.gCtrl.dismissloadin();
           //   alert(JSON.stringify(reponse.data))
            let val =JSON.parse(reponse.data);
              if(val.code=="0"){
                val.operation="restaurant";
                val.type = this.dataclient.item;
                val.resto = this.client.controls['resto'].value;
                //alert(JSON.stringify(val));
                if(this.user!=null)
                {
                  this.gCtrl.getpost("http://services.ajit.sn/ws/resto/fideliseticket?ticket="+val.ticket+"&email="+this.user.username+"&telephone="+this.user.telephone)
                    .then(res=>{
                      //alert(JSON.stringify(res.data))

                    }).catch(err=>{

                  })
                }


          this.navCtrl.setRoot(SucesscommandePage,{data:val});

              }
          }).catch(erreur=>{
            this.gCtrl.dismissloadin();
            alert(JSON.stringify(erreur));
            this.gCtrl.showToast("Problème de connexion internet");

          })*/
    }

  }


}
