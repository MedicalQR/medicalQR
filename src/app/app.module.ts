import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { HomeDoctorsPage } from '../pages/home-doctors/home-doctors';
import { HomePharmacyPage } from '../pages/home-pharmacy/home-pharmacy';
import { NewQrPage } from '../pages/new-qr/new-qr';
import { RegisterPage } from '../pages/register/register';
import { ModalQrPage } from '../pages/modal-qr/modal-qr';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { DatabaseServiceProvider } from '../providers/database-service/database-service';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { HttpClientModule } from '@angular/common/http';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { Guid } from "guid-typescript";
import { ModalPharmacyPage } from '../pages/modal-pharmacy/modal-pharmacy';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { GlobalDataProvider } from '../providers/global-data/global-data';
import { AuthService } from '../providers/auth0/auth.service';

import * as firebase from 'firebase';
import { FirebaseAuthProvider } from '../providers/firebase-auth/firebase-auth';

    //Obtener los datos de la base de firebase, nunca hacer commit con esa info
    /*var config = {
      apiKey: "AIzaSyDUBtCAdjZem5IbH9PqMhudLVAXxJNq51o",
      authDomain: "medicalqr-42850.firebaseapp.com",
      databaseURL: "https://medicalqr-42850.firebaseio.com",
      projectId: "medicalqr-42850",
      storageBucket: "medicalqr-42850.appspot.com",
      messagingSenderId: "988656361007"
    };*/

    var config = {
      apiKey: "AIzaSyAziU1yfRdEP16yrfSVKoSWXi61a58YisQ",
      authDomain: "ionicmedicalqr.firebaseapp.com",
      databaseURL: "https://ionicmedicalqr.firebaseio.com",
      projectId: "ionicmedicalqr",
      storageBucket: "ionicmedicalqr.appspot.com",
      messagingSenderId: "147109891817",
      appId: "1:147109891817:web:0913d36ba5559659092a78"
    };

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomeDoctorsPage,
    HomePharmacyPage,
    RegisterPage,
    NewQrPage,
    ModalQrPage,
    ModalPharmacyPage,
    UserProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config,'medicalqr'),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    BrMaskerModule,
    NgxQRCodeModule,
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomeDoctorsPage,
    HomePharmacyPage,
    RegisterPage,
    NewQrPage,
    ModalQrPage,
    ModalPharmacyPage,
    UserProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseServiceProvider,
    BarcodeScanner,
    GlobalDataProvider,
    AuthService,
    SafariViewController,
    FirebaseAuthProvider
  ]
})
export class AppModule {}
