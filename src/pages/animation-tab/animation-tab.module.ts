import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnimationTabPage } from './animation-tab';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [AnimationTabPage],
  imports: [
    IonicPageModule.forChild(AnimationTabPage), 
    ComponentsModule
  ],
  exports: [AnimationTabPage]
})
export class AnimationTabPageModule {}
