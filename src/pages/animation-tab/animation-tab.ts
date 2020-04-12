import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';

@IonicPage()
@Component({
  selector: 'page-animation-tab',
  templateUrl: 'animation-tab.html',
})
export class AnimationTabPage {
  speed: number;
  pattern: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public ngZone: NgZone,
    private bleProvider: BluetoothProvider) {}

  updatePattern(){
    const patternData = {
      pattern_number: Number(this.pattern), 
      speed: this.speed
    }
    this.bleProvider.setPattern(patternData,
      () => console.log("Updated pattern"),
      () => console.log("Error updating pattern"))
  }

  ionViewDidLoad(){
    this.bleProvider.getPatternFromDevice((pattern) => {
      console.log(`got pattern in tab: ${JSON.stringify(pattern)}`);
      this.pattern = pattern.number;
      this.speed = pattern.speed;
    });
  }

}
