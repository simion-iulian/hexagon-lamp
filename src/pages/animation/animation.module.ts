import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnimationPage } from './animation';

@NgModule({
  declarations: [
    AnimationPage,
  ],
  imports: [
    IonicPageModule.forChild(AnimationPage),
  ],
  exports: [
    AnimationPage
  ]
})
export class AnimationPageModule {}
