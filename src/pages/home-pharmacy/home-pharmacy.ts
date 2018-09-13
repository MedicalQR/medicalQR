import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, MenuController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { ModalPharmacyPage } from '../modal-pharmacy/modal-pharmacy';

@IonicPage()
@Component({
  selector: 'page-home-pharmacy',
  templateUrl: 'home-pharmacy.html',
})
export class HomePharmacyPage {

  qrData = null;
  createdCode = null;
  scannedCode = null;
  qr: any;
  doctor: any;
 
  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, public firebase: DatabaseServiceProvider, public modalCtrl: ModalController, public menuCtrl: MenuController) 
  {
    this.menuCtrl.enable(true, "myMenu");
  }

  ionViewDidLoad() 
  {
    this.menuCtrl.enable(true, "myMenu");
  }

  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
      //this.scannedCode = "c3f600c7-6b53-d438-ddba-cf84bcd2ae73";
      this.firebase.getQRById(this.scannedCode).valueChanges().subscribe(
        qr => {
          this.qr = qr[0]; 
          this.getQRState();
      })
    }, 
    (err) => {
        console.log('Error: ', err);
    });
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
        this.openModal();
    })
  }

  openModal() { 
    let modal = this.modalCtrl.create(ModalPharmacyPage, {qr_id: this.qr.id});
    modal.present();
  }
}