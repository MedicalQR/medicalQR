import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Guid } from "guid-typescript";
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { HomeDoctorsPage } from '../home-doctors/home-doctors';

@IonicPage()
@Component({
  selector: 'page-new-qr',
  templateUrl: 'new-qr.html',
})
export class NewQrPage {
  qrData: Guid;
  createdCode = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: DatabaseServiceProvider) {}

  ionViewDidLoad(){
    this.createCode()
  }

  createCode(){
    this.createdCode = Guid.create().toString();
  }

  saveCode() {
    var image = document.getElementsByClassName("qrcode")[0].innerHTML;
    image = image.slice(10,-2);

    var qr_code = {
      "id": this.createdCode,
      "creation_date": "02/07/2018",
      "image": image,
      "modification_date": "05/07/2018",
      "qr_state_id": "57cc0115-360b-4af3-ad5d-da275d6243d3",
      "user_id": "a3cf01bd-c7f8-4125-9fff-28cd3705f9f9"
    }
    this.firebase.createQR(qr_code);
    this.navCtrl.push(HomeDoctorsPage);
  }

  ignoreCode() {
    this.navCtrl.push(HomeDoctorsPage);
  }
}
