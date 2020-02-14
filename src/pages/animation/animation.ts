import { Component, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AnimationPicker } from '../../components/animation-picker/animation-picker';

const PATTERN = 'ccc2';

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
  device: any = {};
  pattern: number;
  animationPicker : AnimationPicker;
  ble: BLE;
  neopixelService: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private ngZone: NgZone) {
      this.device = navParams.get('device');
      this.ble = navParams.get('ble');
      this.neopixelService = navParams.get('neopixelService');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnimationPage');
  }

  setPattern(event){
    console.log("Selecting pattern on page");
    
    console.log(JSON.stringify(event));
    console.log(JSON.stringify(event.target.id));

    let data = new Uint8Array([1]);
    console.log(this.device.id);
    console.log(this.neopixelService);
    console.log(data);
    this.ble
      .write(this.device.id, this.neopixelService, PATTERN, data.buffer)
      .then(
        () => console.log("Updated pattern"),
        () => console.log("Error updating pattern")
      );
  }
}
