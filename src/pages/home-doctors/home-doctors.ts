import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, MenuController} from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { NewQrPage } from '../new-qr/new-qr';
import { ModalQrPage } from '../modal-qr/modal-qr';
import { GlobalDataProvider } from '../../providers/global-data/global-data';
import { HttpClient } from '@angular/common/http';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home-doctors',
  templateUrl: 'home-doctors.html',
})
export class HomeDoctorsPage {

  doctorId : any;
  qrs: any = [];
  allQrs: any = [];
  pendingQrs: any = [];
  activeQrs: any = [];
  inactiveQrs: any = [];
  allSecurityCodes: any = [];
  code: any = {};
  security_code: boolean;
  all: boolean;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public firebase: DatabaseServiceProvider, public modalCtrl: ModalController,  public globalDataCtrl: GlobalDataProvider, public menuCtrl: MenuController, public http: HttpClient) 
  {
    this.menuCtrl.enable(true, "myMenu");
  }

  ionViewDidLoad(){
    this.doctorId = this.globalDataCtrl.getUser_id();
    this.obtainQRs('Pendiente');
    this.securityCode();
    this.menuCtrl.enable(true, "myMenu");
  }

  securityCode() {
    var apiURL = this.globalDataCtrl.getApiURL();
    return new Promise(resolve => {
      this.http.get(apiURL+'SecurityCodes?doctorId=' + this.doctorId).subscribe((data: any[]) => {
        resolve(this.allSecurityCodes = data);
        if(this.allSecurityCodes.length > 0) {
          this.setActiveSecurityCode();
        }
      }, err => {
        console.log(err);
      });
    });
  }

  setActiveSecurityCode(){
    var compareDate = function (scode1, scode2) {  
      var scode1Date = new Date(scode1.expirationDate).getTime();  
      var scode2Date = new Date(scode2.expirationDate).getTime();  
      return scode1Date > scode2Date ? -1 : 1;    
    }
    var sortedCodes = this.allSecurityCodes.sort(compareDate); 
    this.code = sortedCodes[0]; 
    this.code.expirationDate = new Date(this.code.expirationDate).toLocaleString();
    this.security_code = true; 
  }
  

  obtainQRs(state){
    this.allQrs = [];
    this.security_code = false;
    var apiURL = this.globalDataCtrl.getApiURL();
    return new Promise(resolve => {
      this.http.get(apiURL+'UniqueIdentifierCodes?doctorId=' + this.doctorId).subscribe((data: any[]) => {
        resolve(this.allQrs = data);
        if(this.allQrs.length > 0)
          this.filterQRs(state);
      }, err => {
        console.log(err);
      });
    });
  }

  filterQRs(state){
    this.all = false; 
    this.qrs = [];
    this.pendingQrs = [];
    this.activeQrs = [];
    this.inactiveQrs = [];

    for (let i = 0; i < this.allQrs.length; i++) { 
      if(this.allQrs[i].status == "Pendiente") {
        this.pendingQrs.push(this.allQrs[i]);
      }
      else if(this.allQrs[i].status == "Activo") {
        this.activeQrs.push(this.allQrs[i]);
      }
      else {
        this.inactiveQrs.push(this.allQrs[i]);
      }
    }

    if(state == "Pendiente"){
      this.qrs = this.pendingQrs;
    }
    else if(state == "Activo"){
      this.qrs = this.activeQrs;
    }
    else if(state == "Inactivo"){
      this.qrs = this.inactiveQrs;
    }
    else {
      this.all = true; 
      this.qrs = this.allQrs;
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
    let oldStatus = qr.status;
    qr.status = "Activo";
    qr.modificationDate = new Date();
    this.updateQR(qr);

    if(oldStatus == "Pendiente"){
      let pending = document.getElementById("Pending");
      pending.click();
    }
    else {
      let disabled = document.getElementById("Disabled");
      disabled.click();
    } 
  }

  disable(qr){
    let oldStatus = qr.status;
    qr.status = "Inactivo";
    qr.modificationDate = new Date();
    this.updateQR(qr);

    if(oldStatus == "Pendiente"){
      let pending = document.getElementById("Pending");
      pending.click();
    }
    else {
      let enabled = document.getElementById("Enabled");
      enabled.click();
    } 
  }

  updateQR(updatedQR){
    var apiURL = this.globalDataCtrl.getApiURL();
    return new Promise(resolve => {
      this.http.put(apiURL + "UniqueIdentifierCodes/" + updatedQR.id, updatedQR).subscribe(data => {
        resolve(data);
        this.showPrompt();
      }, err => {
        console.log(err);
      });
    });
  }

  showPrompt() {
    const alert = this.alertCtrl.create({
      title: 'CUI Actualizado',
      subTitle: 'El Código de Identificación Único ha sido actualizado correctamente.',
      buttons: ['OK']
    });
    alert.present();
  }
}
