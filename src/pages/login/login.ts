import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { HomeDoctorsPage } from '../home-doctors/home-doctors';
import { HomePharmacyPage } from '../home-pharmacy/home-pharmacy';
import { HomeMinistryPage } from '../home-ministry/home-ministry';
import { RegisterPage } from '../register/register';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user : any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: DatabaseServiceProvider) {}

  login() {
    //this.navCtrl.push(HomeDoctorsPage);
    if(this.user.mail == "1"){
      this.navCtrl.push(HomeMinistryPage);
    }else{
      this.navCtrl.push(HomeDoctorsPage);
    }
  }

  register() {

  }
} 


