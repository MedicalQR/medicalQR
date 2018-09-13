import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, MenuController} from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { NewQrPage } from '../new-qr/new-qr';
import { ModalQrPage } from '../modal-qr/modal-qr';
import { GlobalDataProvider } from '../../providers/global-data/global-data';

@IonicPage()
@Component({
  selector: 'page-home-doctors',
  templateUrl: 'home-doctors.html',
})
export class HomeDoctorsPage {

  doctorId : any;
  qrs: any = [];
  code: any = {};
  security_code: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: DatabaseServiceProvider, public modalCtrl: ModalController,  public globalDataCtrl: GlobalDataProvider, public menuCtrl: MenuController) 
  {
    this.menuCtrl.enable(true, "myMenu");
  }

  ionViewDidLoad(){
    this.doctorId = this.globalDataCtrl.getUser_id();
    //this.obtainQRs("Pending");
    this.securityCode();
    this.menuCtrl.enable(true, "myMenu");
  }

  securityCode() {
    this.security_code = true;
    this.firebase.getAllUserCodesByUserId(this.doctorId).valueChanges().subscribe(
      code => {
        this.code = code[0];
    })
  }

  obtainQRs(state){
    this.security_code = false;
    let all_qrs = [];
    this.qrs = [];
    this.firebase.getAllQRsByDoctorId(this.doctorId).valueChanges().subscribe(
      qrs => {
        all_qrs = qrs;
        if(all_qrs.length > 0)
          this.filterQRs(state, all_qrs);
    })
  }

  filterQRs(state, all_qrs){
    let qrs = [];

    for (let i = 0; i < all_qrs.length; i++) { 
      if(state == "Pending") {
        if(all_qrs[i].qr_state_id == "57cc0115-360b-4af3-ad5d-da275d6243d3")
          qrs.push(all_qrs[i]);
      }
      else if(state == "Enabled") {
        if(all_qrs[i].qr_state_id == "c815819f-a121-453a-8708-f8b0e1a70215")
          qrs.push(all_qrs[i]);
      }
      else {
        if(all_qrs[i].qr_state_id == "7923230e-9c35-4f93-9fb3-5e2634a0f5e1")
          qrs.push(all_qrs[i]);
      }
    }

    if(qrs.length > 0)
      this.getQRstate(qrs);
  }

  getQRstate(qrs) {
    for (let i = 0; i < qrs.length; i++) {
      this.firebase.getStateById(qrs[i].qr_state_id).valueChanges().subscribe(
        qr_state => { 
          qrs[i].state = qr_state[0];
          this.qrs = [];
          this.qrs = qrs;
      });    
    }
  }

  createQR() {
    this.navCtrl.push(NewQrPage);
  }

  openModal(qr_id) { 
    let modal = this.modalCtrl.create(ModalQrPage, qr_id);
    modal.present();
  }

  enable(qr){
    let old_state = qr.qr_state_id;
    qr.qr_state_id = "c815819f-a121-453a-8708-f8b0e1a70215";

    let dd = "";
    let mm = "";
    let now = new Date();
    let day = now.getDate();
    let month = now.getMonth()+1;
    let yyyy = now.getFullYear();

    if(day < 10) {
      dd = "0" + day;
    }

    if(month < 10){
      mm = "0" + month;
    } 

    let today = dd +'/'+ mm +'/'+ yyyy;

    qr.modification_date = today;

    qr.state = null;
    this.firebase.editQRState(qr);
    if(old_state == "57cc0115-360b-4af3-ad5d-da275d6243d3"){ //Pending state//
      let pending = document.getElementById("Pending");
      pending.click();
    } 
    else { //Disabled state//
      let disabled = document.getElementById("Disabled");
      disabled.click();
    } 
  }

  disable(qr){
    let old_state = qr.qr_state_id;
    qr.qr_state_id = "7923230e-9c35-4f93-9fb3-5e2634a0f5e1";

    let dd = "";
    let mm = "";
    let now = new Date();
    let day = now.getDate();
    let month = now.getMonth()+1;
    let yyyy = now.getFullYear();

    if(day < 10)
      dd = "0" + day;
    else 
      dd = day.toString();

    if(month < 10){
      mm = "0" + month;
    } 

    let today = dd +'/'+ mm +'/'+ yyyy;

    qr.modification_date = today;
    qr.state = null;
    this.firebase.editQRState(qr);
    if(old_state == "57cc0115-360b-4af3-ad5d-da275d6243d3"){ //Pending state//
      let pending = document.getElementById("Pending");
      pending.click();
    }
    else { //Enabled state//
      let enabled = document.getElementById("Enabled");
      enabled.click();
    }
  }
}
