import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoginPage } from '../login/login';
import { BrMaskerModule } from 'brmasker-ionic-3';
import {Md5} from 'ts-md5/dist/md5';
import { Guid } from "guid-typescript";
import { AlertController } from 'ionic-angular';
import { GlobalDataProvider } from '../../providers/global-data/global-data';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  newUser : any = {};
  allPharmacies : any[];
  allDoctors : any[];
  allRoles : any = [];
  allStates : any = [];
  errorMessage : any;
  passwordErrorMessage : any;
  cPasswordErrorMessage : any;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public firebase: DatabaseServiceProvider, private formBuilder: FormBuilder, public globalDataCtrl: GlobalDataProvider, public http: HttpClient) {
    
    this.newUser = this.formBuilder.group({
      document: [''],
      license: [''],
      name : [''],
      lastname : [''],
      companyname : [''],
      businessname : [''],
      email : ['', Validators.compose([Validators.required, Validators.email])],
      role_id: ['', Validators.required],
    })

    this.obtainAllRoles();
  }

  ionViewDidLoad() {
    this.obtainAllRoles();
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
        "name": "Farmacia",
      }
    ];
  }

  registerForm(){
    this.errorMessage = null;
    this.newUser.value.document = this.newUser.value.document.replace('-', '');
    this.newUser.value.document = this.newUser.value.document.replace('-', '');

    if(this.errorMessage != null){
      console.log(this.errorMessage);
    }else if(this.newUser.value.role_id == "Profesionales de la Salud"){
      this.getDoctors().then((result) => {
        if(this.allDoctors.length > 0){
          this.allDoctors.forEach(doctor => {
            if(doctor.medicalLicense == this.newUser.value.license){
              this.errorMessage = "Ya se encuentra registrado un Profesional de la Salud con esa licencia médica.";
              let title = "Usuario ya existente";
              this.showPrompt(this.errorMessage, title);
            }
          });
        }

        if(this.errorMessage == null) {
          let createdUser = {
            medicalLicense : this.newUser.value.license,
            name : this.newUser.value.name,
            lastname: this.newUser.value.lastname,
            email : this.newUser.value.email,
            id : Guid.create().toString(),
            Status : 'Inactivo',
            GmailID: this.globalDataCtrl.getGmailId(),
            FacebookID: this.globalDataCtrl.getFacebookId()
          }
  
          var apiURL = this.globalDataCtrl.getApiURL();
          return new Promise(resolve => {
            this.http.post(apiURL+'Doctors', createdUser).subscribe(data => {
              resolve(data);
              this.goToHome("Profesionales de la Salud");
            }, err => {
              console.log(err);
            });
          });
        }
      });
    }
    else if(this.newUser.value.role_id == "Farmacia") {
      this.getPharmacies().then((result) => {
        if(this.allPharmacies.length > 0){
          this.allPharmacies.forEach(pharmacy => {
            if(pharmacy.cuit == this.newUser.value.document){
              this.errorMessage = "Una Farmacia con ese CUIT ya se encuentra registrado.";
              let title = "Usuario ya existente";
              this.showPrompt(this.errorMessage, title);
            }
          });
        }

        if(this.errorMessage == null) {
          let createdUser = {
            cuit : this.newUser.value.document,
            email: this.newUser.value.email,
            company_name : this.newUser.value.companyname,
            business_name : this.newUser.value.businessname,
            id : Guid.create().toString(),
            Status : 'Inactivo',
            GmailID: this.globalDataCtrl.getGmailId(),
            FacebookID: this.globalDataCtrl.getFacebookId()
          }
  
          var apiURL = this.globalDataCtrl.getApiURL();
          return new Promise(resolve => {
            this.http.post(apiURL+'Pharmacies', createdUser).subscribe(data => {
              resolve(data);
              this.goToHome("Farmacia");
            }, err => {
              console.log(err);
            });
          });
        }
      });
    }
  }

  setValidatorsForMedicalLicense(){
    if(this.newUser.value.role_id == "Profesionales de la Salud"){
      //Habilitar
      this.newUser.controls["license"].setValidators([Validators.required])
      this.newUser.get("license").updateValueAndValidity();
      this.newUser.controls["name"].setValidators([Validators.required])
      this.newUser.get("name").updateValueAndValidity();
      this.newUser.controls["lastname"].setValidators([Validators.required])
      this.newUser.get("lastname").updateValueAndValidity();
    }else if (this.newUser.value.role_id == "Farmacia"){
      //Habilitar
      this.newUser.controls["document"].setValidators([Validators.required])
      this.newUser.get("document").updateValueAndValidity();
      this.newUser.controls["companyname"].setValidators([Validators.required])
      this.newUser.get("companyname").updateValueAndValidity();
      this.newUser.controls["businessname"].setValidators([Validators.required])
      this.newUser.get("businessname").updateValueAndValidity();
    }
  }

  goToHome(role_id){
    let title = '¡Gracias por registrarte!';
    if (role_id == "Profesionales de la Salud"){ //Doctores
      let message = "El Ministerio de salud deberá habilitar tu registro en no menos de 48 horas, te avisaremos una vez el Ministerio habilite tu registro";
      this.showPrompt(message, title);
    }else{ //Farmacias y Administradores
      let message = "Por favor ingresa nuevamente tus datos para acceder a la aplicación";
      this.showPrompt(message, title);
    }
  }

  getPharmacies(){
    var apiURL = this.globalDataCtrl.getApiURL();
    return new Promise(resolve => {
      this.http.get(apiURL+'Pharmacies').subscribe((data: any[]) => {
        resolve(this.allPharmacies = data);
      }, err => {
        console.log(err);
      });
    });
  }

  getDoctors(){
    var apiURL = this.globalDataCtrl.getApiURL();
    return new Promise(resolve => {
      this.http.get(apiURL+'Doctors').subscribe((data: any[]) => {
        resolve(this.allDoctors = data);
      }, err => {
        console.log(err);
      });
    });
  }

  showPrompt(message, title) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
    this.navCtrl.push(LoginPage);
  }
}
