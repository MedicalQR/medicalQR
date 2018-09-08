import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalQrPage } from './modal-qr';

@NgModule({
  declarations: [
    ModalQrPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalQrPage),
  ],
})
export class ModalQrPageModule {}
