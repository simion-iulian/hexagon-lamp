import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PickerTabPage } from './picker-tab';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [PickerTabPage],
  imports: [
    IonicPageModule.forChild(PickerTabPage), 
    ComponentsModule
  ],
  exports: [PickerTabPage]
})
export class PickerTabPageModule {}
