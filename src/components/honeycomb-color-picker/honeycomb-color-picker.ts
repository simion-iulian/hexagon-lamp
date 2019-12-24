import { Component, EventEmitter, Output} from '@angular/core';
import { Color } from '../color';

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
export class HoneycombColorPicker{
  honeycombColors = new Map([
    ["honeycomb-center", new Color(0, 0, 0, 200)]]);

  @Output() colorChange : EventEmitter<Color> = new EventEmitter();
  constructor() {}

  updateColor(event){
    const hexagonID = event.target.id;
    const colorForSelectedHexagon = this.honeycombColors.get(hexagonID);
    console.log("color" + JSON.stringify(colorForSelectedHexagon));
    this.colorChange.emit(colorForSelectedHexagon);

  }
}
