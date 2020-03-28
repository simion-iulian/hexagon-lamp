import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnimationTabPage } from './animation-tab';

@NgModule({
  declarations: [
    AnimationTabPage,
  ],
  imports: [
    IonicPageModule.forChild(AnimationTabPage),
  ],
  exports: [
    AnimationTabPage
  ]
})
export class AnimationTabPageModule {}
