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
  speed: number;
  pattern: string;

  @Output() patternChange : EventEmitter<any> = new EventEmitter(); 
  constructor() {}

  updatePattern(event) {
    console.log("updating in picker")
    console.log(JSON.stringify(event));
    console.log(JSON.stringify(event.target));
    console.log(JSON.stringify(event.target.id));

    // this.patternChange.emit({pattern: 1, speed: this.rainbow_speed, enable_pastel: true});
  }

  selectFn() {
    console.log("selected button " + this.pattern);
  }

  setSpeed() {
    console.log("Speed is " + this.speed);
    console.log("pattern is " + this.pattern);

    this.patternChange.emit({
      pattern_number: Number(this.pattern), 
      speed: this.speed, 
      enable_pastel: true});    
  }
}
