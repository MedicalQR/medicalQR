import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { IfStmt } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { GlobalDataProvider } from '../../providers/global-data/global-data';

@Component({
  templateUrl: 'modal-pharmacy.html',
})
export class ModalPharmacyPage {
    
  qr: any;
  doctor: any;
  id: any;
  info: any = {};
  message: any;
  color: any;
  code: any = {};
  allSecurityCodes: any = [];

  constructor(public platform: Platform, public params: NavParams, public viewCtrl: ViewController, public firebase: DatabaseServiceProvider, public globalDataCtrl: GlobalDataProvider, public http: HttpClient) 
  {
    let qr = {};
    this.qr = this.params.get('qr');  
    let doctor = {};
    this.doctor = doctor;
    let info = {};
    this.info = info;
  }

  ionViewWillEnter(){
    this.getDoctorInformation();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getSecurityCodes(){
    var apiURL = this.globalDataCtrl.getApiURL();
    var securityCodes;
    return new Promise(resolve => {
      this.http.get(apiURL+'SecurityCodes').subscribe((data: any[]) => {
        resolve(securityCodes = data);
        securityCodes.forEach(securityCode => {
          if(securityCode.doctorId == this.doctor.id) {
            this.allSecurityCodes.push(securityCode);
          }
        });
        console.log("line 52");
        console.log(this.allSecurityCodes);
      }, err => {
        console.log(err);
      });
    });
  }

  getDoctorInformation() {
    var apiURL = this.globalDataCtrl.getApiURL();
    return new Promise(resolve => {
      this.http.get(apiURL+'doctors/' + this.qr.doctorId).subscribe((data: any[]) => {
        resolve(this.doctor = data);
        this.getSecurityCodes();
      }, err => {
        console.log(err);
      });
    });
  }

  checkPrescription() {
    let validationCode = document.getElementById("validation_code");
    let validationDate = document.getElementById("validation_date");
    if(this.info.code != null) {
      validationCode.innerHTML = "";
      if(this.info.date != null) {
        console.log("date");
        console.log(this.info.date);
        validationDate.innerHTML = "";
        let splitDate = this.info.date.split("-");
        let yy = splitDate[0];
        let mm = splitDate[1];
        let dd = splitDate[2];
        let date = mm + "/" + dd + "/" + yy;
        var timeDiff = Math.abs(new Date().getTime() - new Date(date).getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        console.log("date date");
        console.log(date);

        if(this.allSecurityCodes.length > 0) {
          console.log("Existen codigos para este doctor");
          this.allSecurityCodes.forEach(securityCode => {
            if(this.info.code == securityCode.securityNumber){
              this.code = securityCode;
              console.log("line 97");
              console.log(this.code);
            }
            else {
              this.writeMessage(false);
            }
          });
        }
        else {
          this.writeMessage(false);
        }

        this.verifyDetails(date, diffDays);
      }
      else 
      validationDate.innerHTML = "Por favor, ingrese la fecha que figura en la receta.";
    }
    else 
    validationCode.innerHTML = "Por favor, ingrese el código de seguridad que figura en la receta.";
  }

  verifyDetails(date, diffDays) {
    let result = false;
    if(this.code != null) {
      if(new Date(this.code.creationDate) < new Date(date) && new Date(date) < new Date(this.code.expirationDate)) {
        console.log("dentro de la creacion y expiracion del codigo");
        if(diffDays < 30) {
          console.log("menor a 30 dias");
          if(this.qr.status == "Activo") {
            console.log("Activo");
            result = true;
          }
          else if(this.qr.status == "Inactivo") {
            if(new Date(date) < new Date(this.qr.modificationDate)) {
              console.log("Inactivo");
              result = true;
            }
          }
          else {
            result = false;
          }
        }
      }
    }

    this.writeMessage(result);
  }

  writeMessage(result) {
    if(result) {
      let message = document.getElementById("message");
      message.innerHTML = "La receta pasó la validación exitosamente.";
      message.style.color = "green";
    }
    else {
      let message = document.getElementById("message");
      message.innerHTML = "Error! La receta no pasó la validación.";
      message.style.color = "red";
    }
  }
}
