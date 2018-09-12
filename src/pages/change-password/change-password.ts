import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {Md5} from 'ts-md5/dist/md5';
import { AlertController } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { GlobalDataProvider } from '../../providers/global-data/global-data';
import { UserProfilePage } from '../user-profile/user-profile';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  passForm : any = {};
  user : any = {};
  message : any = {};

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public globalDataCtrl: GlobalDataProvider, public firebase: DatabaseServiceProvider, private formBuilder: FormBuilder) {
    this.passForm = this.formBuilder.group({
      oldPassword : ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      newPassword : ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      cPassword: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
    })
    this.obtainUserInfo();
  }

  ionViewDidLoad() {
    this.obtainUserInfo();
  }

  obtainUserInfo(){
    this.firebase.getUserById(this.globalDataCtrl.getUser_id()).valueChanges().subscribe(
      user => {
        this.user = user[0];
    })
  }

  changePassForm(){
    let oldPass = Md5.hashStr(this.passForm.value.oldPassword);
    let nPass = Md5.hashStr(this.passForm.value.newPassword);
    let cPass = Md5.hashStr(this.passForm.value.cPassword);
    if(oldPass == this.user.password){
      if(nPass == cPass){
        this.user.password = cPass;
        this.firebase.editDoctorState(this.user);
        this.message = null;
        this.message =  {
          tittle: "¡Éxito!",
          subtittle: "Tu contraseña se ha modificado con éxito"
        }
      }else{
        this.message = null;
        this.message =  {
          tittle: "¡Error!",
          subtittle: "La nueva contraseña no coincide con su confirmación"
        }
      }
    }else{
      this.message = null;
        this.message =  {
          tittle: "¡Error!",
          subtittle: "La contraseña ingresada no coincide con tu actual contraseña"
        }
    }
    this.showPrompt(this.message)
  }

  showPrompt(message) {
    const alert = this.alertCtrl.create({
      title: message.tittle,
      subTitle: message.subtittle,
      buttons: ['OK']
    });
    alert.present();
    if(message.tittle == "¡Éxito!"){
      this.navCtrl.push(UserProfilePage);
    }    
  }

}
