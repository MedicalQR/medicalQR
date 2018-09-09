import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { HomeDoctorsPage } from '../home-doctors/home-doctors';
import { HomePharmacyPage } from '../home-pharmacy/home-pharmacy';
import { HomeMinistryPage } from '../home-ministry/home-ministry';
import { RegisterPage } from '../register/register';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user : any = {};
  private todo : FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: DatabaseServiceProvider, private formBuilder: FormBuilder ) {
    this.user = this.formBuilder.group({
      document: ['', Validators.required],
      password: ['', Validators.required],
      userType : ['', Validators.required],
  });
}

  logForm(){
    console.log(this.user.value)
  }

  login() {
    //this.navCtrl.push(HomeDoctorsPage);
    if(this.user.mail == "1"){
      this.navCtrl.push(HomeMinistryPage);
    }else if(this.user.mail == "2") {
      this.navCtrl.push(HomeDoctorsPage);
    }
    else {
      this.navCtrl.push(HomePharmacyPage);
    }
  }

  register() {

  }
} 


