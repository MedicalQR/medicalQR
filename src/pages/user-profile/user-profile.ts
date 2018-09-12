import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, ViewController } from 'ionic-angular';
import { GlobalDataProvider } from '../../providers/global-data/global-data';
import { DatabaseServiceProvider } from '../../providers/database-service/database-service';
import { ChangePasswordPage } from '../change-password/change-password';

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
    let tempUser = { } 
    this.loggedUser = tempUser;
  }

  ionViewDidLoad() {   
  }

  ionViewWillEnter(){
    this.showUserInfo();
  }

  showUserInfo(){
    this.firebase.getUserById(this.globalDataCtrl.getUser_id()).valueChanges().subscribe(
      user => {
        this.loggedUser = user[0];
        let first2 = this.loggedUser.document.slice(0, 2);
        let last1 = this.loggedUser.document.slice(10,11);
        let middle = this.loggedUser.document.slice(2, 9);
        this.loggedUser.document = first2 + "-" + middle + "-" + last1
    })
  }

  goTo_changePage(){
    //console.log("perro")
    this.navCtrl.push(ChangePasswordPage);
  }
}
