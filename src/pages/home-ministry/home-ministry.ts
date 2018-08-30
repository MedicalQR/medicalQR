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

  //pendingDoctors: any;
  doctors: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: DatabaseServiceProvider) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad HomeMinistryPage');
    this.showPendingDoctors();
  }

  showAllDoctors(){
    this.doctors = null
    this.firebase.getAllDoctors().valueChanges().subscribe(
      doctors => {
        this.doctors = doctors;
        console.log(this.doctors);
    })
  }

  showPendingDoctors(){
    this.doctors = null
    this.firebase.getPendingDoctors().valueChanges().subscribe(
      doctors => {
        this.doctors = doctors;
        console.log(this.doctors);
    })
  }

  showDoctors(selectedButton){
    console.log(selectedButton)
    if(selectedButton == "all"){
      this.showAllDoctors();
    }else {
      this.showPendingDoctors();
    }
     
  }

  enable(){
    this.firebase.getPendingDoctors().valueChanges().subscribe(
      doctor =>{
        console.log(doctor);
      }
    );
  }

  disable(){
    console.log("Inhabilitado");
  }

}
