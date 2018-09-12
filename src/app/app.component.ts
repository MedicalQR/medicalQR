import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomeDoctorsPage } from '../pages/home-doctors/home-doctors';
import { HomeMinistryPage } from '../pages/home-ministry/home-ministry';
import { HomePharmacyPage } from '../pages/home-pharmacy/home-pharmacy';
import { ModalDoctorPage } from '../pages/modal-doctor/modal-doctor';
import { RegisterPage } from '../pages/register/register';
import { ModalQrPage } from '../pages/modal-qr/modal-qr';
import { ModalPharmacyPage } from '../pages/modal-pharmacy/modal-pharmacy';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { GlobalDataProvider } from '../providers/global-data/global-data';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = LoginPage;
  pages: Array<{title: string, component: any}>;
  actualView: any;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public globalDataCtrl: GlobalDataProvider,
  ) {
    this.initializeApp();
    // set our app's pages
    this.pages = [
    ];

    //this.actualView = this.nav.getActive().name;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openHome(){
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(this.globalDataCtrl.getHomePage());
  }

  openProfile(){
    this.menu.close();
    this.nav.setRoot(UserProfilePage);
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  closeSession(){
    this.menu.close();
    this.globalDataCtrl.setUser_id("");
    this.nav.setRoot(LoginPage);
  }
}
