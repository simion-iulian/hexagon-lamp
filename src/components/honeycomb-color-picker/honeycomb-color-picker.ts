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
    ["honeycomb-center",  new Color(  0,  0,  0,200)],
    ["honeycomb-red",     new Color(255,  0,  0,  0)],
    ["honeycomb-green",   new Color(  0,255,  0,  0)],
    ["honeycomb-blue",    new Color(  0,  0,255,  0)],
    ["honeycomb-cyan",    new Color(  0,200,200,  0)],
    ["honeycomb-magenta", new Color(255,  0,220,  0)],
    ["honeycomb-amber",   new Color(200,100,  0,  0)],
    ["honeycomb-green-pastel",   new Color(  0,250,  0,150)],
    [ "honeycomb-cyan-pastel",   new Color(  0,120,140,100)],
    [ "honeycomb-blue-pastel",   new Color(  0,  0,255,110)],
    ["honeycomb-magenta-pastel", new Color(220,  0,200,100)],
    [    "honeycomb-red-pastel", new Color(255,  0,  0,110)],
    [ "honeycomb-amber-pastel",  new Color(250,105,  0,140)],
  ]);

  //this is bound to the detail page honeycomb element
  //and with updating the bluetooth in the detail page
  @Output() colorChange : EventEmitter<Color> = new EventEmitter();
  constructor(){}

  updateColor(event){
    const hexagonID = event.target.id;
    const colorForSelectedHexagon = this.honeycombColors.get(hexagonID);

    this.colorChange.emit(colorForSelectedHexagon);
  }
}
