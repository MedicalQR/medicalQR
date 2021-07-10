import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Guid } from "guid-typescript";
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { HomeDoctorsPage } from '../home-doctors/home-doctors';
import { GlobalDataProvider } from '../../providers/global-data/global-data';
import { HttpClient } from '@angular/common/http';
import { AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-new-qr',
  templateUrl: 'new-qr.html',
})
export class NewQrPage {
  qrData: Guid;
  createdCode = null;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public firebase: DatabaseServiceProvider,  public globalDataCtrl: GlobalDataProvider) {}

  ionViewDidLoad(){
    this.createCode()
  }

  createCode(){
    this.createdCode = Guid.create().toString();
  }

  saveCode() {
    let image = document.getElementsByClassName("qrcode")[0].innerHTML;
    image = image.slice(10,-2);
    let today = new Date();

    let qr_code = {
      "id": this.createdCode,
      "creationDate": today,
      "image": image,
      "modificationDate": today,
      "status": "Pendiente",
      "doctorId": this.globalDataCtrl.getUser_id()
    }

    this.createQR(qr_code);
  }

  createQR(qr_code){
    var apiURL = this.globalDataCtrl.getApiURL();
    return new Promise(resolve => {
      this.http.post(apiURL+'UniqueIdentifierCodes', qr_code).subscribe(data => {
        resolve(data);
        this.showPrompt();
      }, err => {
        console.log(err);
      });
    });
  }

  showPrompt() {
    const alert = this.alertCtrl.create({
      title: "Creación exitosa",
      subTitle: "Se ha generado un nuevo Código Único de Identificación.",
      buttons: ['OK']
    });
    alert.present();
    this.navCtrl.push(HomeDoctorsPage);
  }

  ignoreCode() {
    this.navCtrl.push(HomeDoctorsPage);
  }
}
