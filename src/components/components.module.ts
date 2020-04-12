import { NgModule } from '@angular/core';
import {IonicModule} from 'ionic-angular';
import { HoneycombColorPicker } from './honeycomb-color-picker/honeycomb-color-picker';
@NgModule({
	declarations: [HoneycombColorPicker],
	imports: [IonicModule],
	exports: [HoneycombColorPicker]
})
export class ComponentsModule {}
