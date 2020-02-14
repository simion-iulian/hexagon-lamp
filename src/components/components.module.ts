import { NgModule } from '@angular/core';
import {IonicModule} from 'ionic-angular';
import { HoneycombColorPicker } from './honeycomb-color-picker/honeycomb-color-picker';
import { AnimationPicker } from './animation-picker/animation-picker';
@NgModule({
	declarations: [HoneycombColorPicker, AnimationPicker],
	imports: [IonicModule],
	exports: [HoneycombColorPicker, AnimationPicker]
})
export class ComponentsModule {}
