import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { GlobalDataProvider } from '../../providers/global-data/global-data';
import { HttpClient } from '@angular/common/http';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-modal-qr',
  templateUrl: 'modal-qr.html',
})
export class ModalQrPage {
    
    qr: any;
    id: any;
  
    constructor(public platform: Platform,public params: NavParams,public viewCtrl: ViewController,public firebase: DatabaseServiceProvider, public alertCtrl: AlertController, public http: HttpClient, public globalDataCtrl: GlobalDataProvider) {
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
      var apiURL = this.globalDataCtrl.getApiURL();
      return new Promise(resolve => {
        this.http.get(apiURL+'UniqueIdentifierCodes/' + this.id).subscribe((data: any[]) => {
          resolve(this.qr = data);
          this.qr.creationDate = new Date(this.qr.creationDate).toLocaleString();
          this.qr.modificationDate = new Date(this.qr.modificationDate).toLocaleString();
        }, err => {
          console.log(err);
        });
      });
    }

    sendEmail(){
      var apiURL = this.globalDataCtrl.getApiURL();
      return new Promise(resolve => {
        this.http.get(apiURL+'UniqueIdentifierCodes?id=' + this.qr.id + '&email=' + this.globalDataCtrl.getUserEmail()).subscribe((data: any[]) => {
          resolve(data);
          this.showPrompt();
        }, err => {
          console.log(err);
        });
      });
    }

    showPrompt() {
      const alert = this.alertCtrl.create({
        title: "Email enviado",
        subTitle: "Se ha enviado la información del Código Único de Identificación a su correo.",
        buttons: ['OK']
      });
      alert.present();
      this.dismiss();
    }
  }
