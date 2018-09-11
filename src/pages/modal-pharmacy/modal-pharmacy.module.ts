import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPharmacyPage } from './modal-pharmacy';

@NgModule({
  declarations: [
    ModalPharmacyPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalPharmacyPage),
  ],
})
export class ModalPharmacyPageModule {}
