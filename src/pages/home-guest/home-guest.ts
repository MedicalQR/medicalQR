import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, MenuController} from 'ionic-angular';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { GlobalDataProvider } from '../../providers/global-data/global-data';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

/**
 * Generated class for the HomeGuestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-guest',
  templateUrl: 'home-guest.html',
})
export class HomeGuestPage {

  allRoles : any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public firebase: DatabaseServiceProvider) {
    this.menuCtrl.enable(true, "myMenu");
    this.obtainAllRoles();
  }

  ionViewWillEnter(){
    this.obtainAllRoles();
  }

  obtainAllRoles(){
    this.firebase.getRoles().valueChanges().subscribe(
      roles => {
        this.allRoles = roles;
      }
    )
  }

}
