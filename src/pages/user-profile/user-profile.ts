import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, ViewController } from 'ionic-angular';
import { GlobalDataProvider } from '../../providers/global-data/global-data';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';

/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  loggedUser : any;

  constructor(public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams,  public globalDataCtrl: GlobalDataProvider, public firebase: DatabaseServiceProvider) {
    this.menuCtrl.enable(false, 'myMenu');
    let tempUser = { } 
    this.loggedUser = tempUser;
  }

  ionViewDidLoad() {
    this.menuCtrl.enable(false, 'myMenu');    
  }

  ionViewWillEnter(){
    this.showUserInfo();
  }

  showUserInfo(){
    this.firebase.getUserById(this.globalDataCtrl.getUser_id()).valueChanges().subscribe(
      user => {
        this.loggedUser = user[0];
    })
  }
}
