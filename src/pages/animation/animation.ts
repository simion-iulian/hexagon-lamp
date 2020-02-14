import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AnimationPicker } from '../../components/animation-picker/animation-picker';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';

/**
 * Generated class for the AnimationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-animation',
  templateUrl: 'animation.html',
})
export class AnimationPage {
  pattern: number;
  animationPicker : AnimationPicker;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public ngZone: NgZone,
    private bleProvider: BluetoothProvider) {}

  setPattern(event){
    console.log("Selecting pattern on page" + JSON.stringify(event));
    this.bleProvider.setPattern(event,
      () => console.log("Updated pattern"),
      () => console.log("Error updating pattern"))
  }
}
