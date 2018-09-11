import { Component } from '@angular/core';
import { ModalController, IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import {ModalDoctorPage} from '../modal-doctor/modal-doctor';
import {ChangePasswordPage} from '../change-password/change-password';

/**
 * Generated class for the HomeMinistryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-ministry',
  templateUrl: 'home-ministry.html',
})
export class HomeMinistryPage {

  doctors: any;

  constructor(public menuCtrl: MenuController, public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public firebase: DatabaseServiceProvider) {
    this.menuCtrl.enable(true, 'myMenu');
  }

  openModal(user_id) {
    
    let modal = this.modalCtrl.create(ModalDoctorPage, user_id);
    modal.present();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad HomeMinistryPage');
    this.obtainPendingDoctors();
    this.menuCtrl.enable(true, 'myMenu');
  }

  obtainEnabledDoctors(){
    this.doctors = null;
    this.firebase.getEnabledDoctors().valueChanges().subscribe(
      doctors => {
        this.doctors = this.filterUsersbyRole(doctors);
    })
  }

  obtainDisabledDoctors(){
    this.doctors = null;
    this.firebase.getDisabledDoctors().valueChanges().subscribe(
      doctors => {
        this.doctors = this.filterUsersbyRole(doctors);
    })
  }

  obtainPendingDoctors(){
    this.doctors = null;
    this.firebase.getPendingDoctors().valueChanges().subscribe(
      doctors => {
        this.doctors = this.filterUsersbyRole(doctors);     
    })
  }

  filterUsersbyRole(tempDoctors){
    let filterDoctors = [];
    for (let i = 0; i < tempDoctors.length; i++) {
      if(tempDoctors[i].role_id == "37a938a1-e7f0-42c2-adeb-b8a9a36b6cb8"){
        filterDoctors.push(tempDoctors[i])
      }
    };
    return filterDoctors;
  }

  showDoctors(selectedButton){
    if(selectedButton == "enabled"){
      this.obtainEnabledDoctors();
    }
    else if (selectedButton == "disabled"){
      this.obtainDisabledDoctors();
    }
    else {
      this.obtainPendingDoctors();
    }
  }

  enable(doctor){
    let old_state = doctor.user_state_id;
    doctor.user_state_id = "2103d550-17c2-4ff5-9b61-73e7f4ea6a7f";
    this.firebase.editDoctorState(doctor);
    if(old_state == "bfff8fef-7b54-42c1-bf7f-83232a08cf5c"){ //Pending state//
      this.obtainPendingDoctors();
    }else if(old_state == "2103d550-17c2-4ff5-9b61-73e7f4ea6a7f"){ //Enabled state//
      this.obtainEnabledDoctors();
    }else {
      this.obtainDisabledDoctors();
    } 
  }

  disable(doctor){
    let old_state = doctor.user_state_id;
    doctor.user_state_id = "5058ea0c-3e21-4698-bd91-5f9a891caceb"
    this.firebase.editDoctorState(doctor);
    if(old_state == "bfff8fef-7b54-42c1-bf7f-83232a08cf5c"){ //Pending state//
      this.obtainPendingDoctors();
    }else if(old_state == "2103d550-17c2-4ff5-9b61-73e7f4ea6a7f"){ //Enabled state//
      this.obtainEnabledDoctors();
    }else {
      this.obtainDisabledDoctors();
    } 
  }
}
