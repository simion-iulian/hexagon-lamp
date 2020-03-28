import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PickerTabPage } from './picker-tab';

@NgModule({
  declarations: [
    PickerTabPage,
  ],
  imports: [
    IonicPageModule.forChild(PickerTabPage),
  ],
  exports: [
    PickerTabPage
  ]
})
export class PickerTabPageModule {}
