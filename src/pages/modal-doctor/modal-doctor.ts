import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';


@Component({
  templateUrl: 'modal-doctor.html'
})
export class ModalDoctorPage {
    
    doctor;
    allDoctors : any;
    selectedDoctorsId;
  
    constructor(
      public platform: Platform,
      public params: NavParams,
      public viewCtrl: ViewController,
      public firebase: DatabaseServiceProvider
    ) {
        this.selectedDoctorsId = this.params.get('user_id');    
        
        var doc = { } 

        this.doctor = doc;    

    }

    ionViewWillEnter(){
        this.obtainAllDoctors();
    }
  
    dismiss() {
      this.viewCtrl.dismiss();
    }

    obtainAllDoctors(){
        this.allDoctors = null;
        this.firebase.getAllUsers().valueChanges().subscribe(
          doctors => {
            this.allDoctors = doctors;
            this.selectedDoctorsId = this.params.get('user_id');      
            
            this.allDoctors.forEach(doctor => {
                if(this.selectedDoctorsId == doctor.user_id){
                    this.doctor = doctor;
                    this.doctor.document.toString();
                    let first2 = this.doctor.document.slice(0, 2);
                    let last1 = this.doctor.document.slice(10,11);
                    let middle = this.doctor.document.slice(2, 9);
                    this.doctor.document = first2 + "-" + middle + "-" + last1
                }
            });
        })
    }
  }