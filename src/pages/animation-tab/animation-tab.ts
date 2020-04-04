import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AnimationPicker } from '../../components/animation-picker/animation-picker';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';

@IonicPage()
@Component({
  selector: 'page-animation-tab',
  templateUrl: 'animation-tab.html',
})
export class AnimationTabPage {
  pattern: number;
  animationPicker : AnimationPicker;
  relationship: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public ngZone: NgZone,
    private bleProvider: BluetoothProvider) {}

  setPattern(event){
    console.log("Selecting pattern on page " + JSON.stringify(event));
    this.bleProvider.setPattern(event,
      () => console.log("Updated pattern"),
      () => console.log("Error updating pattern"))
  }
}
