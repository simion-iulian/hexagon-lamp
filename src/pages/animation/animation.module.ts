import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnimationPage } from './animation';
import { AnimationPicker } from '../../components/animation-picker/animation-picker';

@NgModule({
  declarations: [
    AnimationPage, AnimationPicker
  ],
  imports: [
    IonicPageModule.forChild(AnimationPage),
  ],
  exports: [
    AnimationPage, AnimationPicker
  ]
})
export class AnimationPageModule {}
