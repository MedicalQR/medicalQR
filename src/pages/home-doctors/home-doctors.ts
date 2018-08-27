import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';

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
    this.firebase.getAllQRs().valueChanges().subscribe(
      qrs => {
        this.qrs = qrs;
        console.log(this.qrs);
        this.getQRstate();
    })
  }

  getQRstate() {
    for (let i = 0; i < this.qrs.length; i++) {
      console.log(this.qrs[i]);
      console.log(this.qrs[i].qr_state_id);
      this.firebase.getStateById(this.qrs[i].qr_state_id).valueChanges().subscribe(
        qr_state => { 
          this.qrs[i].state = qr_state;
          console.log(this.qrs);
      });    
    }
  }
}
