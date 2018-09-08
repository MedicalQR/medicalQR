import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BrMaskerModule } from 'brmasker-ionic-3';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  newUser : any = {};
  allRoles : any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: DatabaseServiceProvider, private formBuilder: FormBuilder) {
    
    this.newUser = this.formBuilder.group({
      document: ['', Validators.required],
      license: ['', Validators.required],
      name : ['', Validators.required],
      password : ['', Validators.required],
      cPassword: ['', Validators.required],
      role_id: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    this.obtainAllRoles();
  }


  obtainAllRoles(){
    this.firebase.getRoles().valueChanges().subscribe(
      roles => {
        this.allRoles = roles;
      }
    )
  }

  registerForm(){
    console.log(this.newUser)
  }

}
