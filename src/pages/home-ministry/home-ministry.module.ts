import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeMinistryPage } from './home-ministry';

@NgModule({
  declarations: [
    HomeMinistryPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeMinistryPage),
  ],
})
export class HomeMinistryPageModule {}
