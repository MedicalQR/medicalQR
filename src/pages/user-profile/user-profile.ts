import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, ViewController } from 'ionic-angular';
import { GlobalDataProvider } from '../../providers/global-data/global-data';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { ChangePasswordPage } from '../change-password/change-password';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { HttpClient } from '@angular/common/http';
import { HomeDoctorsPage } from '../home-doctors/home-doctors';
import { HomePharmacyPage } from '../home-pharmacy/home-pharmacy';
import { HomeMinistryPage } from '../home-ministry/home-ministry';
import { AlertController } from 'ionic-angular';
import { Guid } from "guid-typescript";

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  loggedUser : any;
  role: any;

  constructor(public menuCtrl: MenuController, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,  public globalDataCtrl: GlobalDataProvider, private afAuth: AngularFireAuth, public firebase: DatabaseServiceProvider, public http: HttpClient) {
    let tempUser = {} 
    this.loggedUser = tempUser;
  }

  ionViewDidLoad() {   
  }

  ionViewWillEnter(){
    this.showUserInfo();
  }

  showUserInfo(){
    this.role = this.globalDataCtrl.getRole();
    let user_id = this.globalDataCtrl.getUser_id();
    let url = "";
    if(this.role == "Profesionales de la Salud") {
      url = "doctors/"
    }
    else if(this.role == "Farmacia") {
      url = "pharmacies/"
    }
    else { 
      url = "admins/"
    }
    this.getUserById(url + user_id).then((result) => {
      console.log(this.loggedUser);
    });
  }

  getUserById(url){
    var apiURL = this.globalDataCtrl.getApiURL();
    return new Promise(resolve => {
      this.http.get(apiURL+url).subscribe((data: any) => {
        resolve(this.loggedUser = data);
      }, err => {
        console.log(err);
      });
    });
  }

  updateUser(updatedUser, url){
    var apiURL = this.globalDataCtrl.getApiURL();
    return new Promise(resolve => {
      this.http.put(apiURL + url + "/" + updatedUser.id, updatedUser).subscribe(data => {
        resolve(data);
        this.showPrompt();
      }, err => {
        console.log(err);
      });
    });
  }

  async loginGoogle() {
    let googleProvider = new firebase.auth.GoogleAuthProvider();
    const res = await this.afAuth.auth.signInWithPopup(googleProvider);
    const user = res.user; user.uid;
    let updatedUser = {};
    
    if(this.role == "Profesionales de la Salud") {
      updatedUser = {
        medicalLicense : this.loggedUser.medicalLicense,
        name : this.loggedUser.name,
        lastName: this.loggedUser.lastName,
        email : this.loggedUser.email,
        id : this.loggedUser.id,
        Status : this.loggedUser.Status,
        GmailID: user.uid,
        FacebookID: this.loggedUser.FacebookID,
      }
      this.updateUser(updatedUser, "doctors");
    }
    else if(this.role == "Farmacia") {
      updatedUser = {
        cuit : this.loggedUser.cuit,
        company_name : this.loggedUser.company_name,
        business_name: this.loggedUser.business_name,
        email : this.loggedUser.email,
        id : this.loggedUser.id,
        GmailID: user.uid,
        FacebookID: this.loggedUser.FacebookID,
      }
      this.updateUser(updatedUser, "pharmacies");
    }
    else { 
      updatedUser = {
        name : this.loggedUser.name,
        lastName: this.loggedUser.lastName,
        email : this.loggedUser.email,
        id : this.loggedUser.id,
        GmailID: user.uid,
        FacebookID: this.loggedUser.FacebookID,
      }
      this.updateUser(updatedUser, "admins");
    }
 }

  async loginFacebook() {
    //var facebookProvider = new firebase.auth.FacebookAuthProvider();
    //this.afAuth.auth.signInWithPopup(facebookProvider)
    //.then((result) => {
      //const user = res.user; user.uid;
      let updatedUser = {};
      if(this.role == "Profesionales de la Salud") {
        updatedUser = {
          medicalLicense : this.loggedUser.medicalLicense,
          name : this.loggedUser.name,
          lastName: this.loggedUser.lastName,
          email : this.loggedUser.email,
          id : this.loggedUser.id,
          Status : this.loggedUser.Status,
          GmailID: this.loggedUser.GmailID,
          FacebookID: Guid.create().toString(),
        }
        this.updateUser(updatedUser, "doctors");
      }
      else if(this.role == "Farmacia") {
        updatedUser = {
          cuit : this.loggedUser.cuit,
          company_name : this.loggedUser.company_name,
          business_name: this.loggedUser.business_name,
          email : this.loggedUser.email,
          id : this.loggedUser.id,
          GmailID: this.loggedUser.GmailID,
          FacebookID: Guid.create().toString(),
        }
        this.updateUser(updatedUser, "pharmacies");
      }
      else { 
        updatedUser = {
          name : this.loggedUser.name,
          lastName: this.loggedUser.lastName,
          email : this.loggedUser.email,
          id : this.loggedUser.id,
          GmailID: this.loggedUser.GmailID,
          FacebookID: Guid.create().toString(),
        }
        this.updateUser(updatedUser, "admins");
      }
    /*})
    .catch(err => { 
        console.log(err.message);
    });*/
  }

  showPrompt() {
    const alert = this.alertCtrl.create({
      title: "Cambio realizado",
      subTitle: "Información de perfil actualizada",
      buttons: ['OK']
    });
    alert.present();
    if(this.role == "Profesionales de la Salud") {
      this.navCtrl.push(HomeDoctorsPage);
    }
    else if(this.role == "Farmacia") {
      this.navCtrl.push(HomePharmacyPage);
    }
    else { 
      this.navCtrl.push(HomeMinistryPage);
    }
  }
  
  removeGmail(){
    let updatedUser = {};
    if(this.role == "Profesionales de la Salud") {
      updatedUser = {
        medicalLicense : this.loggedUser.medicalLicense,
        name : this.loggedUser.name,
        lastName: this.loggedUser.lastName,
        email : this.loggedUser.email,
        id : this.loggedUser.id,
        Status : this.loggedUser.Status,
        GmailID: null,
        FacebookID: this.loggedUser.FacebookID,
      }
      this.updateUser(updatedUser, "doctors");
    }
    else if(this.role == "Farmacia") {
      updatedUser = {
        cuit : this.loggedUser.cuit,
        company_name : this.loggedUser.company_name,
        business_name: this.loggedUser.business_name,
        email : this.loggedUser.email,
        id : this.loggedUser.id,
        GmailID: null,
        FacebookID: this.loggedUser.FacebookID,
      }
      this.updateUser(updatedUser, "pharmacies");
    }
    else { 
      updatedUser = {
        name : this.loggedUser.name,
        lastName: this.loggedUser.lastName,
        email : this.loggedUser.email,
        id : this.loggedUser.id,
        GmailID: null,
        FacebookID: this.loggedUser.FacebookID,
      }
      this.updateUser(updatedUser, "admins");
    }
  }

  removeFacebook(){
    let updatedUser = {};
    if(this.role == "Profesionales de la Salud") {
      updatedUser = {
        medicalLicense : this.loggedUser.medicalLicense,
        name : this.loggedUser.name,
        lastName: this.loggedUser.lastName,
        email : this.loggedUser.email,
        id : this.loggedUser.id,
        Status : this.loggedUser.Status,
        GmailID: this.loggedUser.GmailID,
        FacebookID: null,
      }
      this.updateUser(updatedUser, "doctors");
    }
    else if(this.role == "Farmacia") {
      updatedUser = {
        cuit : this.loggedUser.cuit,
        company_name : this.loggedUser.company_name,
        business_name: this.loggedUser.business_name,
        email : this.loggedUser.email,
        id : this.loggedUser.id,
        GmailID: this.loggedUser.GmailID,
        FacebookID: null,
      }
      this.updateUser(updatedUser, "pharmacies");
    }
    else { 
      updatedUser = {
        name : this.loggedUser.name,
        lastName: this.loggedUser.lastName,
        email : this.loggedUser.email,
        id : this.loggedUser.id,
        GmailID: this.loggedUser.GmailID,
        FacebookID: null,
      }
      this.updateUser(updatedUser, "admins");
    }
  }
}
