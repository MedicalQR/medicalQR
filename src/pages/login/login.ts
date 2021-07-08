import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { HomeDoctorsPage } from '../home-doctors/home-doctors';
import { HomePharmacyPage } from '../home-pharmacy/home-pharmacy';
import { HomeMinistryPage } from '../home-ministry/home-ministry';
import { HomeGuestPage } from '../home-guest/home-guest';
import { RegisterPage } from '../register/register';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { AlertController } from 'ionic-angular';
import {Md5} from 'ts-md5/dist/md5';
import {ChangePasswordPage} from '../change-password/change-password';
import { GlobalDataProvider } from '../../providers/global-data/global-data';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user : any = {};
  correctUser : any = {};
  existingUser : any = {};

  doctors: any[];
  pharmacies: any[];
  admins: any[];
  allRoles: any[];
  
  loggedUser : any = {};
  errorMessage : any;
  private todo : FormGroup;

  picture;
  name;
  email;
  uid; 

  constructor(public menuCtrl: MenuController, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public firebase: DatabaseServiceProvider, private formBuilder: FormBuilder,  public globalDataCtrl: GlobalDataProvider, private afAuth: AngularFireAuth, public http: HttpClient) {
    this.loggedUser = this.formBuilder.group({
      document: ['', Validators.required],
      password: ['', Validators.required],
      role : ['', Validators.required],
    });
    this.menuCtrl.enable(false, 'myMenu');
  }

  ionViewWillEnter(){
    //this.obtainAllUsers();
    this.obtainAllRoles();
  }

  obtainAllUsers(){
    var apiURL = this.globalDataCtrl.getApiURL();
    return new Promise(resolve => {
      this.http.get(apiURL+'api/Doctors').subscribe(data => {
        resolve(data);
        console.log(data);
      }, err => {
        console.log(err);
      });
    });
    /*this.firebase.getAllUsers().valueChanges().subscribe(
      allUsers => {
        this.allUsers = allUsers;
      }
    )*/
  }

  obtainAllRoles(){
    this.allRoles = [
      {
        "name": "Profesionales de la Salud",
      },
      {
        "name": "Administrador",
      },
      {
        "name": "Farmacia",
      }
    ];
  }

  async loginGoogle() {
    this.existingUser = null;
    const res = await this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    const user = res.user;
    this.uid = user.uid; 

    this.getDoctors().then((result) => {
      if(this.doctors.length > 0){
        this.doctors.forEach(doctor => {
          if(doctor.GoogleId == this.uid){
            this.existingUser = doctor;
            this.existingUser.role = 'Doctor';
          }
        });
        console.log("finished doctors");
      }
      if(this.existingUser == null){
        this.getPharmacies().then((result) => {
          if(this.pharmacies.length > 0){
            this.pharmacies.forEach(pharmacy => {
              if(pharmacy.GoogleId == this.uid){
                this.existingUser = pharmacy;
                this.existingUser.role = 'Pharmacy';
              }
            });
          }
        });
        console.log("finished pharmacies");
      }
      if(this.existingUser == null) {
        this.getAdmins().then((result) => {
          if(this.pharmacies.length > 0){
            this.pharmacies.forEach(pharmacy => {
              if(pharmacy.GoogleId == this.uid){
                this.existingUser = pharmacy;
                this.existingUser.role = 'Pharmacy';
              }
            });
          }
        });
        console.log("finished admins");
      }
      if(this.existingUser == null) {
        this.navCtrl.push(RegisterPage);
      }
    });

    //Si es la primera vez que inician sesión utilizando Facebook debería ser redirigido a la página de Registro/Brindarle tambien la posiblidad de loguearse, por si su cuenta ya existe. 
    //Si NO es la primera vez, debería validarse el ID de Facebook con el usuario que esté creado y redirigir a esa página.
    //this.globalDataCtrl.setHomePage(HomeGuestPage);
    //this.navCtrl.push(HomeGuestPage);
 }
  
  async loginFacebook() {
    var provider = new firebase.auth.FacebookAuthProvider();
    this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
        //Si es la primera vez que inician sesión utilizando Facebook debería ser redirigido a la página de Registro/Brindarle tambien la posiblidad de loguearse, por si su cuenta ya existe. 
        //Si NO es la primera vez, debería validarse el ID de Facebook con el usuario que esté creado y redirigir a esa página.
        console.log(result);
        this.globalDataCtrl.setHomePage(HomeGuestPage);
        this.navCtrl.push(HomeGuestPage);
    })
    .catch(err => { 
        console.log(err.message);
    })
  }

  logForm(){
    this.correctUser = {};
    this.errorMessage = null;

    this.loggedUser.value.document = this.loggedUser.value.document.replace('-', '');
    this.loggedUser.value.document = this.loggedUser.value.document.replace('-', '');
    this.loggedUser.value.document = this.loggedUser.value.document.toString();
    let document = this.loggedUser.value.document;
    let role = this.loggedUser.value.role;

    //this.validateUser(role, document);

    if(this.errorMessage != "Los datos ingresados no son correctos"){
      let hashPass = Md5.hashStr(this.loggedUser.value.password);
      if(hashPass == this.correctUser.password){
        if(this.correctUser.Status == "Active"){//Usuario habilitado
          this.globalDataCtrl.setUser_id(this.correctUser.id);
          if (this.correctUser.role_id == "37a938a1-e7f0-42c2-adeb-b8a9a36b6cb8"){ //Doctores
            this.globalDataCtrl.setHomePage(HomeDoctorsPage);
            this.navCtrl.push(HomeDoctorsPage, {
              id: this.correctUser.id
            });
          } else if (this.correctUser.role_id == "35d0b156-e7be-4af1-a84d-3e9e30a2bd06"){ //Ministerio
            this.globalDataCtrl.setHomePage(HomeMinistryPage);
            this.navCtrl.push(HomeMinistryPage);
          } else {
            this.globalDataCtrl.setHomePage(HomePharmacyPage);
            this.navCtrl.push(HomePharmacyPage);
          }
        } else {  
          this.errorMessage = null;
          this.errorMessage = {
            tittle: "¡Error!",
            subtittle: "Los datos ingresados no son correctos"
          }
        }
      } else {
        this.errorMessage = null;
        this.errorMessage =  {
          tittle: "¡Error!",
          subtittle: "El usuario que has ingresado no se encuentra habilitado; por favor contáctate con nuestra área de Atención al cliente"
        }
      }
    } else{
      this.errorMessage = null;
      this.errorMessage =  {
        tittle: "¡Error!",
        subtittle: "Los datos ingresados no son correctos"
      }
    } 

    if(this.errorMessage != null){
      this.showPrompt(this.errorMessage)
    }

    /*var apiURL = this.globalDataCtrl.getApiURL();
    return new Promise(resolve => {
      this.http.get(apiURL+urlRole).subscribe(data => {
        resolve(data);
        this.allUsers = data; 
        for (let i = 0; i < this.allUsers.length; i++) {
          if(this.allUsers[i].document == this.loggedUser.value.document){
            this.errorMessage = null;
            this.correctUser = this.allUsers[i];
            this.correctUser.role = role; 
            break;
          }else{
            this.errorMessage = {
              tittle: "¡Error!",
              subtittle: "Los datos ingresados no son correctos"
            }
          }
        } 
        console.log(data);
      }, err => {
        console.log(err);
      });
    });*/
  }

  showPrompt(message) {
    const alert = this.alertCtrl.create({
      title: message.tittle,
      subTitle: message.subtittle,
      buttons: ['OK']
    });
    alert.present();
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  getDoctors(){
    var apiURL = this.globalDataCtrl.getApiURL();
    return new Promise(resolve => {
      this.http.get(apiURL+'Doctors').subscribe((data: any[]) => {
        resolve(this.doctors = data);
      }, err => {
        console.log(err);
      });
    });
  }

  getPharmacies(){
    var apiURL = this.globalDataCtrl.getApiURL();
    return new Promise(resolve => {
      this.http.get(apiURL+'Pharmacies').subscribe((data: any[]) => {
        resolve(this.pharmacies = data);
      }, err => {
        console.log(err);
      });
    });
  }

  getAdmins(){
    var apiURL = this.globalDataCtrl.getApiURL();
    return new Promise(resolve => {
      this.http.get(apiURL+'Admins').subscribe((data: any[]) => {
        resolve(this.admins = data);
      }, err => {
        console.log(err);
      });
    });
  }

  recoveryPassword() {
    /*let message = null;
    if(this.loggedUser.value.document == null || this.loggedUser.value.document.length <= 0){
      message =  {
        tittle: "¡Error!",
        subtittle: "Indica un CUIT/CUIL por favor"
      }
    } else {
      this.loggedUser.value.document = this.loggedUser.value.document.replace('-', '');
      this.loggedUser.value.document = this.loggedUser.value.document.replace('-', '');
      this.loggedUser.value.document = this.loggedUser.value.document.toString();
      for (let i = 0; i < this.allUsers.length; i++) {
        if(this.allUsers[i].document == this.loggedUser.value.document){
          message =  {
            tittle: "¡Alerta!",
            subtittle: "Se ha enviado un correo electrónico con tu nueva contraseña al e-mail que indicaste en tu formulario de registro"
          }
          break;
        }
      }
      if (message == null){
        message =  {
          tittle: "¡Error!",
          subtittle: "Indica un CUIT/CUIL válido"
        }
      }
    }
    this.showPrompt(message)*/
  }
} 