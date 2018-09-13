import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { IfStmt } from '@angular/compiler';

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
  code: any;

  constructor(public platform: Platform, public params: NavParams, public viewCtrl: ViewController, public firebase: DatabaseServiceProvider) 
  {
    this.id = this.params.get('qr_id');  
    var qr = {};
    this.qr = qr;    
    var doctor = {};
    this.doctor = doctor;
    var info = {};
    this.info = info;
  }

  ionViewWillEnter(){
    this.obtainQRById();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  obtainQRById() {
    this.firebase.getQRById(this.id).valueChanges().subscribe(
      qr => {
        this.qr = qr[0]; 
        this.getQRState();
    })
  }

 getQRState() {
    this.firebase.getStateById(this.qr.qr_state_id).valueChanges().subscribe(
      qr_state => {
        this.qr.state = qr_state[0];
        this.getDoctorInformation();
    })
  }

  getDoctorInformation() {
    this.firebase.getDoctorById(this.qr.user_id).valueChanges().subscribe(
      doctor => {
        this.doctor = doctor[0];
        this.getDoctorState();
    })
  }

  getDoctorState(){
    this.firebase.getDoctorStateById(this.doctor.user_state_id).valueChanges().subscribe(
      doctor_state => {
        this.doctor.state = doctor_state[0];
    }) 
  }

  checkPrescription() {
    let validationCode = document.getElementById("validation_code");
    let validationDate = document.getElementById("validation_date");
    if(this.info.code != null) {
      validationCode.innerHTML = "";
      if(this.info.date != null) {
        validationDate.innerHTML = "";
        let splitDate = this.info.date.split("-");
        let yy = splitDate[0];
        let mm = splitDate[1];
        let dd = splitDate[2];
        let date = mm + "/" + dd + "/" + yy;
        var timeDiff = Math.abs(new Date().getTime() - new Date(date).getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

        this.firebase.getAllSecurityCodes().valueChanges().subscribe(
          code => {
            this.code = code[0];
            console.log(this.code);
            console.log(this.info.code);
            this.verifyCodeAndDate(date, diffDays);
        })
      }
      else 
      validationDate.innerHTML = "Por favor, ingrese la fecha que figura en la receta.";
    }
    else 
    validationCode.innerHTML = "Por favor, ingrese el código de seguridad que figura en la receta.";
  }

  verifyCodeAndDate(date, diffDays) {
    let result = false;
    if(this.qr.state == "Habilitado") {
      console.log("habilitado");
      if(this.code != null) {
        if(this.code.code == this.info.code) {
          console.log("code existe");
          if(this.code.user_id == this.qr.user_id) {
            console.log("el codigo es del user");
            if(new Date(this.code.creation_date) < new Date(date)) {
              if(new Date(date) < new Date(this.code.expiration_date)) {
                console.log("dentro de la creacion y expiracion del codigo");
                if(diffDays < 30) {
                  console.log("menor a 30 dias");
                  result = true;
                }
                else 
                console.log("mayor a 30 dias");
              }
              else {
                console.log("fuera de expiracion");
              }
            }
            else {
              console.log("fuera de la creacion");
            }
          }
          else 
          console.log("codigo no es de user");
        }
        else 
        console.log("codigo no existe");
      }
    }
    else if(this.qr.state == "Inhabilitado") {
      console.log("inhabilitado");
      if(new Date(date) < new Date(this.qr.modification_date)) {
        console.log("date anterior a la ultima mod");
        if(this.code != null) {
          if(this.code.code == this.info.code) {
            console.log("code existe");
            if(this.code.user_id == this.qr.user_id) {
              console.log("el codigo es del user");
              if(new Date(this.code.creation_date) < new Date(date) || new Date(date) < new Date(this.code.expiration_date)) {
                console.log("dentro de la creacion y expiracion del codigo");
                if(diffDays < 30) {
                  console.log("menor a 30 dias");
                  result = true;
                }
              }
            }
          }
        }
      }
    }
    else {
      result = false;
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
