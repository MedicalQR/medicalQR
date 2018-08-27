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

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: DatabaseServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeMinistryPage');
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
