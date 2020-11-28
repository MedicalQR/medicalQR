import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeGuestPage } from './home-guest';

@NgModule({
  declarations: [
    HomeGuestPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeGuestPage),
  ],
})
export class HomeGuestPageModule {}
