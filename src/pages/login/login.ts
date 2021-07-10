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
    let googleProvider = new firebase.auth.GoogleAuthProvider();
    const res = await this.afAuth.auth.signInWithPopup(googleProvider);
    const user = res.user;
    this.uid = user.uid; 
    this.globalDataCtrl.setGmailId(this.uid);
    this.getDoctors().then((result) => {
      if(this.doctors.length > 0){
        this.doctors.forEach(doctor => {
          if(doctor.GmailID == this.uid){
            this.existingUser = doctor;
            this.setGlobalInformation(doctor.id, "Profesionales de la Salud");
            if(this.existingUser.Status == 'Activo'){
              this.globalDataCtrl.setHomePage(HomeDoctorsPage);
              this.navCtrl.push(HomeDoctorsPage, {
                id: this.existingUser.id
              });
            } else {
              this.goToHome("Profesionales de la Salud");
            }
          }
        });
      }
      if(this.existingUser == null){
        this.getPharmacies().then((result) => {
          if(this.pharmacies.length > 0){
            this.pharmacies.forEach(pharmacy => {
              if(pharmacy.GmailID == this.uid){
                this.existingUser = pharmacy;
                this.setGlobalInformation(pharmacy.id, "Farmacia");
                this.globalDataCtrl.setHomePage(HomePharmacyPage);
                this.navCtrl.push(HomePharmacyPage);
              }
            });
          }
        });
      }
      if(this.existingUser == null) {
        this.getAdmins().then((result) => {
          if(this.admins.length > 0){
            this.admins.forEach(admin => {
              if(admin.GmailID == this.uid){
                this.existingUser = admin;
                this.setGlobalInformation(admin.id, "Administrator");
                this.globalDataCtrl.setHomePage(HomeMinistryPage);
                this.navCtrl.push(HomeMinistryPage);
              }
            });
          }
        });
      }
      if(this.existingUser == null) {
        this.navCtrl.push(RegisterPage);
      }
    });
 }
  
  async loginFacebook() {
    var facebookProvider = new firebase.auth.FacebookAuthProvider();
    this.afAuth.auth.signInWithPopup(facebookProvider)
    .then((result) => {
      this.getDoctors().then((result) => {
        if(this.doctors.length > 0){
          this.doctors.forEach(doctor => {
            if(doctor.FacebookID == this.uid){
              this.existingUser = doctor;
              this.setGlobalInformation(doctor.id, "Profesionales de la Salud");
              if(this.existingUser.Status == 'Activo'){
                this.globalDataCtrl.setHomePage(HomeDoctorsPage);
                this.navCtrl.push(HomeDoctorsPage, {
                  id: this.existingUser.id
                });
              } else {
                this.goToHome("Profesionales de la Salud");
              }
            }
          });
        }
        if(this.existingUser == null){
          this.getPharmacies().then((result) => {
            if(this.pharmacies.length > 0){
              this.pharmacies.forEach(pharmacy => {
                if(pharmacy.FacebookID == this.uid){
                  this.existingUser = pharmacy;
                  this.setGlobalInformation(pharmacy.id, "Farmacia");
                  this.globalDataCtrl.setHomePage(HomePharmacyPage);
                  this.navCtrl.push(HomePharmacyPage);
                }
              });
            }
          });
        }
        if(this.existingUser == null) {
          this.getAdmins().then((result) => {
            if(this.admins.length > 0){
              this.admins.forEach(admin => {
                if(admin.FacebookID == this.uid){
                  this.existingUser = admin;
                  this.setGlobalInformation(admin.id, "Administrator");
                  this.globalDataCtrl.setHomePage(HomeMinistryPage);
                  this.navCtrl.push(HomeMinistryPage);
                }
              });
            }
          });
        }
        if(this.existingUser == null) {
          this.navCtrl.push(RegisterPage);
        }
      });
    })
    .catch(err => { 
        console.log(err.message);
    })
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

  goToHome(role_id){
    if (role_id == "Profesionales de la Salud"){ //Doctores
      let message = "El Ministerio de salud deberá habilitar tu registro en no menos de 48 horas, te avisaremos una vez el Ministerio habilite tu registro";
      this.showPrompt(message);
    }else if (role_id == "Farmacia"){ //Farmacias
      let message = "Por favor ingresa nuevamente tus datos para acceder a la aplicación";
      this.showPrompt(message);
    }
  }

  setGlobalInformation(userId, role){
    this.globalDataCtrl.setUser_id(userId);
    this.globalDataCtrl.setRole(role);
  }

  showPrompt(message) {
    const alert = this.alertCtrl.create({
      title: 'Pendiente de habilitación',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
    this.navCtrl.push(LoginPage);
  }
} 