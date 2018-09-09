import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BrMaskerModule } from 'brmasker-ionic-3';
import {Md5} from 'ts-md5/dist/md5';
import { Guid } from "guid-typescript";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: DatabaseServiceProvider, private formBuilder: FormBuilder) {
    
    this.newUser = this.formBuilder.group({
      document: ['', Validators.required],
      license: ['', Validators.required],
      name : ['', Validators.required],
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
        password : this.newUser.value.cPassword,
        role_id : this.newUser.value.role_id,
        user_id : Guid.create().toString(),
        user_state_id : this.newUser.value.user_state_id
      }
      console.log(createdUser)
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
      this.newUser.value.user_state_id = "5058ea0c-3e21-4698-bd91-5f9a891caceb" //Inhabiltado
    } else {
      this.newUser.value.user_state_id = "2103d550-17c2-4ff5-9b61-73e7f4ea6a7f" //Habilitado
    }
  }

}
