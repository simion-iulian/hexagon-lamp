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
    ["honeycomb-center",  new Color(0,0,0,200)],
    ["honeycomb-red",     new Color(255,0,0,0)],
    ["honeycomb-green",   new Color(0,255,0,0)],
    ["honeycomb-blue",    new Color(0,0,255,0)],
    ["honeycomb-cyan",    new Color(0,255,255,0)],
    ["honeycomb-magenta", new Color(255,0,255,0)],
    ["honeycomb-orange",  new Color(255,120,0,0)]
  ]);

  @Output() colorChange : EventEmitter<Color> = new EventEmitter();
  constructor() {}

  updateColor(event){
    const hexagonID = event.target.id;
    const colorForSelectedHexagon = this.honeycombColors.get(hexagonID);

    this.colorChange.emit(colorForSelectedHexagon);
  }
}
