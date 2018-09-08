import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewQrPage } from './new-qr';

@NgModule({
  declarations: [
    NewQrPage,
  ],
  imports: [
    IonicPageModule.forChild(NewQrPage),
  ],
})
export class NewQrPageModule {}
