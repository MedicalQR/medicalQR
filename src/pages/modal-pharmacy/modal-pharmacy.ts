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

  constructor(public platform: Platform, public params: NavParams, public viewCtrl: ViewController, public firebase: DatabaseServiceProvider) 
  {
    this.id = this.params.get('qr_id');  
    console.log("id");
    console.log(this.id);
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
        console.log("This.Qr");
        console.log(this.qr);
        this.getQRState();
    })
  }

 getQRState() {
    this.firebase.getStateById(this.qr.qr_state_id).valueChanges().subscribe(
      qr_state => {
        this.qr.state = qr_state[0];
        console.log("This.Qr state ");
        console.log(this.qr.state);
        this.getDoctorInformation();
    })
  }

  getDoctorInformation() {
    this.firebase.getDoctorById(this.qr.user_id).valueChanges().subscribe(
      doctor => {
        this.doctor = doctor[0];
        console.log("doctor from modal");
        console.log(this.doctor);
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
    let result = false;
    if(this.info.date != "") {
      let splitDate = this.info.date.split("-");
      let yy = splitDate[0];
      let mm = splitDate[1];
      let dd = splitDate[2];
      let date = dd + "/" + "/" + mm + "/" + yy;
   
      if(this.qr.state == "Inhabilitado") {
        if(new Date(date) > new Date(this.qr.modification_date)){
          result = false;
        }
        /*else if(this.info.code == "444444"){

        }*/
      }
      else if(this.qr.state == "Pendiente") {
        result = true;
      }
  }
    console.log(this.info)
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
