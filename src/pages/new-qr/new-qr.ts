import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Guid } from "guid-typescript";
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { HomeDoctorsPage } from '../home-doctors/home-doctors';
import { GlobalDataProvider } from '../../providers/global-data/global-data';

@IonicPage()
@Component({
  selector: 'page-new-qr',
  templateUrl: 'new-qr.html',
})
export class NewQrPage {
  qrData: Guid;
  createdCode = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: DatabaseServiceProvider,  public globalDataCtrl: GlobalDataProvider) {}

  ionViewDidLoad(){
    this.createCode()
  }

  createCode(){
    this.createdCode = Guid.create().toString();
  }

  saveCode() {
    let image = document.getElementsByClassName("qrcode")[0].innerHTML;
    image = image.slice(10,-2);

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

    let qr_code = {
      "id": this.createdCode,
      "creation_date": today,
      "image": image,
      "modification_date": today,
      "qr_state_id": "57cc0115-360b-4af3-ad5d-da275d6243d3",
      "user_id": this.globalDataCtrl.getUser_id()
    }
    this.firebase.createQR(qr_code);
    this.navCtrl.push(HomeDoctorsPage);
  }

  ignoreCode() {
    this.navCtrl.push(HomeDoctorsPage);
  }
}
