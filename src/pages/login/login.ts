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
    this.obtainAllRoles();
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
    this.globalDataCtrl.setGmailId(this.uid);

    this.getDoctors().then((result) => {
      if(this.doctors.length > 0){
        this.doctors.forEach(doctor => {
          if(doctor.GmailID == this.uid){
            this.existingUser = doctor;
            this.existingUser.role = 'Doctor';
            this.globalDataCtrl.setHomePage(HomeDoctorsPage);
            this.navCtrl.push(HomeDoctorsPage, {
              id: this.existingUser.id
            });
          }
        });
        console.log("finished doctors");
      }
      if(this.existingUser == null){
        this.getPharmacies().then((result) => {
          if(this.pharmacies.length > 0){
            this.pharmacies.forEach(pharmacy => {
              if(pharmacy.GmailID == this.uid){
                this.existingUser = pharmacy;
                this.existingUser.role = 'Pharmacy';
                this.globalDataCtrl.setHomePage(HomePharmacyPage);
                this.navCtrl.push(HomePharmacyPage);
              }
            });
          }
        });
        console.log("finished pharmacies");
      }
      if(this.existingUser == null) {
        this.getAdmins().then((result) => {
          if(this.admins.length > 0){
            this.admins.forEach(admin => {
              if(admin.GmailID == this.uid){
                this.existingUser = admin;
                this.existingUser.role = 'Administrator';
                this.globalDataCtrl.setHomePage(HomeMinistryPage);
                this.navCtrl.push(HomeMinistryPage);
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
} 