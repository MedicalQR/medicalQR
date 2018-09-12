import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { HomeDoctorsPage } from '../home-doctors/home-doctors';
import { HomePharmacyPage } from '../home-pharmacy/home-pharmacy';
import { HomeMinistryPage } from '../home-ministry/home-ministry';
import { RegisterPage } from '../register/register';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { AlertController } from 'ionic-angular';
import {Md5} from 'ts-md5/dist/md5';
import {ChangePasswordPage} from '../change-password/change-password';
import { GlobalDataProvider } from '../../providers/global-data/global-data';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user : any = {};
  correctUser : any = {};
  loggedUser : any = {};
  allUsers : any = {};
  allRoles : any;
  errorMessage : any;
  private todo : FormGroup;

  constructor(public menuCtrl: MenuController, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public firebase: DatabaseServiceProvider, private formBuilder: FormBuilder,  public globalDataCtrl: GlobalDataProvider) {
    this.loggedUser = this.formBuilder.group({
      document: ['', Validators.required],
      password: ['', Validators.required],
      role : ['', Validators.required],
    });
    this.menuCtrl.enable(false, 'myMenu');
    this.allUsers = {};
    this.allRoles = [];
    this.obtainAllUsers();
    this.obtainAllRoles();
  }

  ionViewWillEnter(){
    this.obtainAllUsers();
    this.obtainAllRoles();
  }

  obtainAllUsers(){
    this.firebase.getAllUsers().valueChanges().subscribe(
      allUsers => {
        this.allUsers = allUsers;
      }
    )
  }

  obtainAllRoles(){
    this.firebase.getRoles().valueChanges().subscribe(
      roles => {
        this.allRoles = roles;
      }
    )
  }
    

  logForm(){
    this.correctUser = {};
    this.errorMessage = null;

    this.loggedUser.value.document = this.loggedUser.value.document.replace('-', '');
    this.loggedUser.value.document = this.loggedUser.value.document.replace('-', '');
    this.loggedUser.value.document = this.loggedUser.value.document.toString();

    for (let i = 0; i < this.allUsers.length; i++) {
      if(this.allUsers[i].document == this.loggedUser.value.document){
        this.errorMessage = null;
        this.correctUser = this.allUsers[i];
        break;
      }else{
        this.errorMessage = {
          tittle: "¡Error!",
          subtittle: "Los datos ingresados no son correctos"
        }
      }
    } 

    if(this.errorMessage != "Los datos ingresados no son correctos"){
      let hashPass = Md5.hashStr(this.loggedUser.value.password)
      if(hashPass == this.correctUser.password){
        if(this.correctUser.user_state_id == "2103d550-17c2-4ff5-9b61-73e7f4ea6a7f"){//Usuario habilitado
          if(this.loggedUser.value.role == this.correctUser.role_id){
            this.globalDataCtrl.setUser_id(this.correctUser.user_id);
            if (this.correctUser.role_id == "37a938a1-e7f0-42c2-adeb-b8a9a36b6cb8"){ //Doctores
              this.globalDataCtrl.setHomePage(HomeDoctorsPage);
              this.navCtrl.push(HomeDoctorsPage, {
                id: this.correctUser.user_id
              });
            }else if (this.correctUser.role_id == "35d0b156-e7be-4af1-a84d-3e9e30a2bd06"){ //Ministerio
              this.globalDataCtrl.setHomePage(HomeMinistryPage);
              this.navCtrl.push(HomeMinistryPage);
            }else {
              this.globalDataCtrl.setHomePage(HomePharmacyPage);
              this.navCtrl.push(HomePharmacyPage);
            }
          }else{  
            this.errorMessage = null;
            this.errorMessage = {
              tittle: "¡Error!",
              subtittle: "Los datos ingresados no son correctos"
            }
          }
        }else {
          this.errorMessage = null;
          this.errorMessage =  {
            tittle: "¡Error!",
            subtittle: "El usuario que has ingresado no se encuentra habilitado; por favor contáctate con nuestra área de Atención al cliente"
          }
        }
      }else{
        this.errorMessage = null;
        this.errorMessage =  {
          tittle: "¡Error!",
          subtittle: "Los datos ingresados no son correctos"
        }
      } 
    }   

    if(this.errorMessage != null){
      this.showPrompt(this.errorMessage)
    }
  }

  showPrompt(message) {
    const alert = this.alertCtrl.create({
      title: message.tittle,
      subTitle: message.subtittle,
      buttons: ['OK']
    });
    alert.present();
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  recoveryPassword() {
    let message = null;
    if(this.loggedUser.value.document == null || this.loggedUser.value.document.length <= 0){
      message =  {
        tittle: "¡Error!",
        subtittle: "Indica un CUIT/CUIL por favor"
      }
    } else {
      this.loggedUser.value.document = this.loggedUser.value.document.replace('-', '');
      this.loggedUser.value.document = this.loggedUser.value.document.replace('-', '');
      this.loggedUser.value.document = this.loggedUser.value.document.toString();
      for (let i = 0; i < this.allUsers.length; i++) {
        if(this.allUsers[i].document == this.loggedUser.value.document){
          message =  {
            tittle: "¡Alerta!",
            subtittle: "Se ha enviado un correo electrónico con tu nueva contraseña al e-mail que indicaste en tu formulario de registro"
          }
          break;
        }
      }
      if (message == null){
        message =  {
          tittle: "¡Error!",
          subtittle: "Indica un CUIT/CUIL válido"
        }
      }
    }
    this.showPrompt(message)
  }
} 


