import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, NavController} from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomeDoctorsPage } from '../pages/home-doctors/home-doctors';
import { HomePharmacyPage } from '../pages/home-pharmacy/home-pharmacy';
import { RegisterPage } from '../pages/register/register';
import { ModalQrPage } from '../pages/modal-qr/modal-qr';
import { ModalPharmacyPage } from '../pages/modal-pharmacy/modal-pharmacy';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { GlobalDataProvider } from '../providers/global-data/global-data';
import firebase from 'firebase/app';
import 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { AlertController } from 'ionic-angular';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  firstRun: boolean = true;
  pages: Array<{title: string, component: any}>;
  actualView: any;
  user : any = {};
  existingUser : any = {};
  doctors: any[];
  pharmacies: any[];
  allRoles: any[];
  errorMessage : any;
  uid; 
  ui: any;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public globalDataCtrl: GlobalDataProvider,
    public http: HttpClient,
    public alertCtrl: AlertController
  ) {
    //this.initializeApp();
    // set our app's pages
    this.pages = [
    ];

    //Obtener los datos de la base de firebase, nunca hacer commit con esa info
    /*var config = {
      apiKey: "AIzaSyDUBtCAdjZem5IbH9PqMhudLVAXxJNq51o",
      authDomain: "medicalqr-42850.firebaseapp.com",
      databaseURL: "https://medicalqr-42850.firebaseio.com",
      projectId: "medicalqr-42850",
      storageBucket: "medicalqr-42850.appspot.com",
      messagingSenderId: "988656361007"
    };*/
    var config = {
      apiKey: "AIzaSyAziU1yfRdEP16yrfSVKoSWXi61a58YisQ",
      authDomain: "ionicmedicalqr.firebaseapp.com",
      databaseURL: "https://ionicmedicalqr.firebaseio.com",
      projectId: "ionicmedicalqr",
      storageBucket: "ionicmedicalqr.appspot.com",
      messagingSenderId: "147109891817",
      appId: "1:147109891817:web:0913d36ba5559659092a78"
    };

    firebase.initializeApp(config);

    //this.actualView = this.nav.getActive().name;
  }

  ngAfterViewInit() {
    this.existingUser = null;
    firebase.auth().onAuthStateChanged((user) => {
      console.log("linea 71");
      if (user) {
        console.log(user);
        this.uid  = user.uid;
        this.globalDataCtrl.setGmailId(this.uid);
        this.getDoctors().then((result) => {
          if(this.doctors.length > 0){
            this.doctors.forEach(doctor => {
              if(doctor.GmailID == this.uid){
                console.log("doctor");
                console.log(doctor);
                this.existingUser = doctor;
                this.setGlobalInformation(doctor.id, "Profesionales de la Salud");
                if(this.existingUser.Status == 'Activo'){
                  this.globalDataCtrl.setUserEmail(this.existingUser.email);
                  this.globalDataCtrl.setHomePage(HomeDoctorsPage);
                  console.log("HomeDoctorsPage");
                  this.setRootPage(HomeDoctorsPage);
                } else {
                  this.goToHome("Profesionales de la Salud");
                  this.setRootPage(LoginPage);
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
                    this.globalDataCtrl.setUserEmail(this.existingUser.email);
                    this.globalDataCtrl.setHomePage(HomePharmacyPage);
                    this.setRootPage(HomePharmacyPage);
                  }
                });
              }
            });
          }
          if(this.existingUser == null) {
            this.setRootPage(RegisterPage);
          }
        })
      } else {
        // User is not authenticated.
        this.setRootPage(LoginPage);
      }
    });
  }

  setRootPage(page) {
    console.log("page");
    if (this.firstRun) {

      // if its the first run we also have to hide the splash screen
      this.nav.setRoot(page)
        .then(() => this.platform.ready())
        .then(() => {

          // Okay, so the platform is ready and our plugins are available.
          // Here you can do any higher level native things you might need.
          this.statusBar.styleDefault();
          this.splashScreen.hide();
          this.firstRun = false;
        });
    } else {
      this.nav.setRoot(page);
    }
  }

  /*initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });
  }*/

  openHome(){
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.setRootPage(LoginPage);
  }

  openProfile(){
    this.menu.close();
    this.setRootPage(UserProfilePage);
  }

  closeSession(){
    firebase.auth().signOut();
    this.menu.close();
    this.globalDataCtrl.setUser_id("");
    this.globalDataCtrl.setSessionFlag(true);
    this.setRootPage(LoginPage);
  }

  register() {
    this.setRootPage(RegisterPage);
  }

  getDoctors(){
    var apiURL = this.globalDataCtrl.getApiURL();
    return new Promise(resolve => {
      this.http.get(apiURL+'Doctors').subscribe((data: any[]) => {
        resolve(this.doctors = data);
      }, err => {
        console.log("getDoctors error");
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
    //this.navCtrl.push(LoginPage);
  }
}
