import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';


@Component({
  templateUrl: 'modal-doctor.html'
})
export class ModalDoctorPage {
    
    doctor;
    allDoctors : any;
    id;
  
    constructor(
      public platform: Platform,
      public params: NavParams,
      public viewCtrl: ViewController,
      public firebase: DatabaseServiceProvider
    ) {
        this.id = this.params.get('user_id');    
        
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
            this.id = this.params.get('user_id');      
            
            this.allDoctors.forEach(doctor => {
                if(this.id == doctor.user_id){
                    this.doctor = doctor;
                }
            });
        })
    }
  }