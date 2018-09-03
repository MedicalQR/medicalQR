import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';

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
  doctors_state: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: DatabaseServiceProvider) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad HomeMinistryPage');
    this.obtainPendingDoctors();
  }

  obtainEnabledDoctors(){
    this.doctors = null
    this.firebase.getEnabledDoctors().valueChanges().subscribe(
      doctors => {
        this.doctors = doctors;
    })
  }

  obtainDisabledDoctors(){
    this.doctors = null
    this.firebase.getDisabledDoctors().valueChanges().subscribe(
      doctors => {
        this.doctors = doctors;
    })
  }

  obtainPendingDoctors(){
    this.doctors = null
    this.firebase.getPendingDoctors().valueChanges().subscribe(
      doctors => {
        this.doctors = doctors;
    })
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
