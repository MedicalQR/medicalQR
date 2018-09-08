import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { NewQrPage } from '../new-qr/new-qr';

@IonicPage()
@Component({
  selector: 'page-home-doctors',
  templateUrl: 'home-doctors.html',
})
export class HomeDoctorsPage {

  qrs: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: DatabaseServiceProvider) {}

  ionViewDidLoad() {
    //Recupera todos los cóidgos QR de la base de datos. 
    this.firebase.getAllQRsById().valueChanges().subscribe(
      qrs => {
        this.qrs = qrs;
        console.log(this.qrs);
        this.getQRstate();
    })
  }

  getQRstate() {
    for (let i = 0; i < this.qrs.length; i++) {
      this.firebase.getStateById(this.qrs[i].qr_state_id).valueChanges().subscribe(
        qr_state => { 
          console.log(qr_state);
          this.qrs[i].state = qr_state[0];
          console.log(this.qrs[i].state);
      });    
    }
  }

  disableQR(qr) {
    console.log("disable qr code");
  }

  editQR(qr) {
    console.log("edit qr code");
  }

  createQR() {
    this.navCtrl.push(NewQrPage);
  }
}
