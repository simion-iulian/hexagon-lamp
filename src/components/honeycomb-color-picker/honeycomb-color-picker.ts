import { Component} from '@angular/core';
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
  honeycombColors = {"honeycomb-center": new Color(0, 0, 0, 200)};

  constructor() {
    console.log("creating color picker");
    console.log(JSON.stringify(this.honeycombColors))
  }

  updateColor(event){
    console.log("updating color from honeycomb");
    const hexagon_touched = event.target.id;
    console.log("Touched: " + hexagon_touched)
    console.log(JSON.stringify(this.honeycombColors))
    console.log("setting color" + JSON.stringify(this.honeycombColors[hexagon_touched]));    
    console.log(event);
  }
}
