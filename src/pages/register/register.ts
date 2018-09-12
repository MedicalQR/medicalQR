import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoginPage } from '../login/login';
import { BrMaskerModule } from 'brmasker-ionic-3';
import {Md5} from 'ts-md5/dist/md5';
import { Guid } from "guid-typescript";
import { AlertController } from 'ionic-angular';


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
  allUsers : any = {};
  allRoles : any = [];
  allStates : any = [];
  errorMessage : any;
  passwordErrorMessage : any;
  cPasswordErrorMessage : any;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public firebase: DatabaseServiceProvider, private formBuilder: FormBuilder) {
    
    this.newUser = this.formBuilder.group({
      document: ['', Validators.compose([Validators.required, Validators.minLength(13)])],
      license: [''],
      name : ['', Validators.required],
      email : ['', Validators.compose([Validators.required, Validators.email])],
      password : ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      cPassword: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      role_id: ['', Validators.required],
    })
    this.allUsers = {};
    this.obtainAllRoles();
    this.obtainAllUsers();   
 
  }

  ionViewDidLoad() {
    this.obtainAllRoles();
    this.obtainAllUsers();
  }

  ionViewWillEnter(){
    this.obtainAllRoles();
    this.obtainAllUsers();
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
        roles.splice(0, 1); 
        this.allRoles = roles;
      }
    )
  }

  obtainAllUsersStates(){
    this.firebase.getAllUsersStates().valueChanges().subscribe(
      usersStates => {
        this.allStates = usersStates;
      }
    )
  }

  registerForm(){
    this.errorMessage = null;
    this.newUser.value.document = this.newUser.value.document.replace('-', '');
    this.newUser.value.document = this.newUser.value.document.replace('-', '');
    this.findDuplicateDocument(this.newUser.value.document);
    this.newUser.value.password = Md5.hashStr(this.newUser.value.password);
    this.newUser.value.cPassword = Md5.hashStr(this.newUser.value.cPassword);
    if(this.errorMessage == null){
      this.comparePasswords(this.newUser.value.password, this.newUser.value.cPassword)
    }
    if(this.errorMessage != null){
      console.log(this.errorMessage)
    }else{
      this.obtainCorrectState();
      let createdUser = {
        document : this.newUser.value.document,
        license : this.newUser.value.license,
        name : this.newUser.value.name,
        email : this.newUser.value.email,
        password : this.newUser.value.cPassword,
        role_id : this.newUser.value.role_id,
        user_id : Guid.create().toString(),
        user_state_id : this.newUser.value.user_state_id
      }
      this.firebase.createUser(createdUser);
      this.goToHome(createdUser.role_id);
    }
  }

  findDuplicateDocument(document){
    this.errorMessage = null;
    for (let i = 0; i < this.allUsers.length; i++) {
      if(this.allUsers[i].document == document){
        this.errorMessage = "El usuario ya se encuentra registrado";
        break;
      }
    } 
  }

  comparePasswords(password, confirmPassword){
    this.errorMessage = null;
    if(password != confirmPassword){
      this.errorMessage = "Las contraseñas ingresadas no coinciden";
    }
  }

  obtainCorrectState(){
    if(this.newUser.value.role_id == "37a938a1-e7f0-42c2-adeb-b8a9a36b6cb8"){ //Profesionales de la salud
      this.newUser.value.user_state_id = "bfff8fef-7b54-42c1-bf7f-83232a08cf5c" //Pendiente
    } else {
      this.newUser.value.user_state_id = "2103d550-17c2-4ff5-9b61-73e7f4ea6a7f" //Habilitado
    }
  }

  checkEmptyPassword(){
    this.passwordErrorMessage = false
    this.cPasswordErrorMessage = false
    let valuePassword = this.newUser.value.password
    let valuecPassword = this.newUser.value.cPassword

    if(valuePassword.length < 8){
      this.passwordErrorMessage = true
    }else {
      this.passwordErrorMessage = false
    }

    if(valuecPassword.length < 8){
      this.cPasswordErrorMessage = true
    }else {
      this.cPasswordErrorMessage = false
    }
  }

  setValidatorsForMedicalLicense(){
    if(this.newUser.value.role_id == "37a938a1-e7f0-42c2-adeb-b8a9a36b6cb8"){
      this.newUser.controls["license"].setValidators([Validators.required])
      this.newUser.get("license").updateValueAndValidity();
    }else if (this.newUser.value.role_id == "bd94bc0d-53d6-47e0-8bf6-95fc63b28a93"){
      this.newUser.value.license = "";
      this.newUser.get("license").clearValidators();
      this.newUser.get("license").updateValueAndValidity();
    }
  }
  goToHome(role_id){
    if (role_id == "37a938a1-e7f0-42c2-adeb-b8a9a36b6cb8"){ //Doctores
      let message = "El Ministerio de salud deberá habilitar tu registro en no menos de 48 horas, te avisaremos una vez el Ministerio habilite tu registro";
      this.showPrompt(message);
    }else if (role_id == "bd94bc0d-53d6-47e0-8bf6-95fc63b28a93"){ //Farmacias
      let message = "Por favor ingresa nuevamente tus datos para acceder a la aplicación";
      this.showPrompt(message);
    }
  }

  showPrompt(message) {
    const alert = this.alertCtrl.create({
      title: '¡Gracias por registrarte!',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
    this.navCtrl.push(LoginPage);
  }
}
