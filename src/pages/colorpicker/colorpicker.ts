import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HoneycombColorPicker } from '../../components/honeycomb-color-picker/honeycomb-color-picker';
import { AnimationPage } from '../animation/animation';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';

@Component({
  selector: 'page-colorpicker',
  templateUrl: 'colorpicker.html',
})
export class ColorPickerPage {
  peripheral: any = {};
  colorPicker : HoneycombColorPicker;
  red: number;
  green: number;
  blue: number;
  white: number;
  brightness: number;
  speed: number;
  power: boolean;
  animationPage = AnimationPage;
  animationParams: Object;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private bleProvider: BluetoothProvider) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ColorPickerPage');
  }

  ionViewWillLeave() {
    console.log('Leaving color picker page');
  }

  colorToBluetoothData(color){
    return new Uint8Array([
      color.R, 
      color.G, 
      color.B, 
      color.W]).buffer;
  }

  sendColorToLamp(data, successCallback, failCallback){
    this.bleProvider.sendColor(data,successCallback,failCallback)
  }

  updateModelColors(color) {
    this.red = color.R;
    this.green = color.G;
    this.blue = color.B;
    this.white = color.W;
  }

  updateLampColor(colorEvent) {    
    console.log("colorpicker send to lamp")
    console.log(JSON.stringify(colorEvent));

    let data = this.colorToBluetoothData(colorEvent);
    console.log("data before sending" + JSON.stringify(data));
    
    this.updateModelColors(colorEvent);
    this.sendColorToLamp(data,
      () => console.log("Updated with: " + JSON.stringify(data)),
      () => console.log("Error updating" + JSON.stringify(data)));
  }

  setColor(event){
    this.updateLampColor({R: this.red, G: this.green, B:this.blue, W: this.white});
  }

  onPowerSwitchChange(event) {
    console.log('onPowerSwitchChange');
    let value = this.power ? 1 : 0;
    let data = new Uint8Array([value]);
    console.log('Power Switch Property ' + this.power);
    // this.ble.write(this.peripheral.id, NEOPIXEL_SERVICE, POWER_SWITCH, data.buffer).then(
    //   () => {
    //     console.log('Updated power switch')
    //     if (this.power && this.brightness === 0) {
    //       this.brightness = 0x3f; // cheating, should rely on notification
    //     }
    //   },
    //   () => console.log('Error updating  power switch')
    // );
  }
}
