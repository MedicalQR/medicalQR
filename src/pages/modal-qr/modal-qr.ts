import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';

@Component({
  selector: 'page-modal-qr',
  templateUrl: 'modal-qr.html',
})
export class ModalQrPage {
    
    qr: any;
    id: any;
  
    constructor(public platform: Platform,public params: NavParams,public viewCtrl: ViewController,public firebase: DatabaseServiceProvider) {
      this.id = this.params.get('qr_id');    
      var qr = {};
      this.qr = qr;    
    }

    ionViewWillEnter(){
        this.obtainQRById();
    }
  
    dismiss() {
      this.viewCtrl.dismiss();
    }

    obtainQRById(){
        this.firebase.getQRById(this.id).valueChanges().subscribe(
          qr => {
            this.qr = qr[0];
            this.getQRState(this.qr);
            console.log(this.qr);
        })
    }

    getQRState(qr) {
      this.firebase.getStateById(qr.qr_state_id).valueChanges().subscribe(
        qr_state => { 
          qr.state = qr_state[0];
          this.qr = qr;
      });    
    }

    printQR(){
      alert("Imprimir");
    }
  }
