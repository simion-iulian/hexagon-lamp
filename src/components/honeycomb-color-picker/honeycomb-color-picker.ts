import { Component } from '@angular/core';

/**
 * Generated class for the HoneycombColorPicker component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'honeycomb-color-picker',
  templateUrl: 'honeycomb-color-picker.html'
})
export class HoneycombColorPicker {

  text: string;

  constructor() {
    console.log('Hello HoneycombColorPickerComponent Component');
    this.text = 'Hello World';
  }

}
