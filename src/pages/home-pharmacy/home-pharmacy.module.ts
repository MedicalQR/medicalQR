import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePharmacyPage } from './home-pharmacy';

@NgModule({
  declarations: [
    HomePharmacyPage,
  ],
  imports: [
    IonicPageModule.forChild(HomePharmacyPage),
  ],
})
export class HomePharmacyPageModule {}
