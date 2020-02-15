import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Generated class for the AnimationPickerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'animation-picker',
  templateUrl: 'animation-picker.html'
})
export class AnimationPicker {
  rainbow_speed: number;

  @Output() patternChange : EventEmitter<any> = new EventEmitter(); 
  constructor() {}

  updatePattern(event) {
    console.log("updating in picker")
    console.log(JSON.stringify(event));
    console.log(JSON.stringify(event.target));
    console.log(JSON.stringify(event.target.id));

    // this.patternChange.emit({pattern: 1, speed: this.rainbow_speed, enable_pastel: true});
  }

  setSpeed() {
    console.log("Speed is" + this.rainbow_speed)
    this.patternChange.emit({
      pattern_number: 1, 
      speed: this.rainbow_speed, 
      enable_pastel: true});    
  }
}
