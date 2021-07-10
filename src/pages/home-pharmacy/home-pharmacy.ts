import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, MenuController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { ModalPharmacyPage } from '../modal-pharmacy/modal-pharmacy';
import { HttpClient } from '@angular/common/http';
import { GlobalDataProvider } from '../../providers/global-data/global-data';

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
 
  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, public firebase: DatabaseServiceProvider, public modalCtrl: ModalController, public menuCtrl: MenuController, public globalDataCtrl: GlobalDataProvider, public http: HttpClient) 
  {
    this.menuCtrl.enable(true, "myMenu");
  }

  ionViewDidLoad() 
  {
    this.menuCtrl.enable(true, "myMenu");
  }

  scanCode() {
    //this.barcodeScanner.scan().then(barcodeData => {
      //this.scannedCode = barcodeData.text;
      this.scannedCode = "9DD6E0B5-2E94-8295-D310-8DBB0878A8C6";
      var apiURL = this.globalDataCtrl.getApiURL();
      return new Promise(resolve => {
        this.http.get(apiURL+'UniqueIdentifierCodes/' + this.scannedCode).subscribe((data: any[]) => {
          resolve(this.qr = data);
          this.getDoctorInformation()
        }, err => {
          console.log(err);
        });
      });
    /*}, 
    (err) => {
        console.log('Error: ', err);
    });*/
  }
  
  getDoctorInformation() {
    var apiURL = this.globalDataCtrl.getApiURL();
    return new Promise(resolve => {
      this.http.get(apiURL+'doctors/' + this.qr.doctorId).subscribe((data: any[]) => {
        resolve(this.doctor = data);
        this.openModal();
      }, err => {
        console.log(err);
      });
    });
  }

  openModal() { 
    let modal = this.modalCtrl.create(ModalPharmacyPage, {qr: this.qr});
    modal.present();
  }
}