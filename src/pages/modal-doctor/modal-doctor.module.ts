import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalDoctorPage } from './modal-doctor';

@NgModule({
  declarations: [
    ModalDoctorPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalDoctorPage),
  ],
})
export class ModalDoctorPageModule {}