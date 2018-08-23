import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeDoctorsPage } from './home-doctors';

@NgModule({
  declarations: [
    HomeDoctorsPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeDoctorsPage),
  ],
})
export class HomeDoctorsPageModule {}
