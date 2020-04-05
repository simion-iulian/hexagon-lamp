import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';
import { HoneycombColorPicker } from '../../components/honeycomb-color-picker/honeycomb-color-picker';

@IonicPage()
@Component({
  selector: 'page-picker-tab',
  templateUrl: 'picker-tab.html',
})
export class PickerTabPage {
  colorPicker : HoneycombColorPicker;
  red: number;
  green: number;
  blue: number;
  white: number;
  power: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private bleProvider: BluetoothProvider,
              private toastCtrl: ToastController,
              ) {} 

  onDeviceDisconnected() {
    let toast = this.toastCtrl.create({
      message: 'The peripheral unexpectedly disconnected',
      duration: 3000,
      position: 'center'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  updateModelColors(color) {
    this.red = color.R;
    this.green = color.G;
    this.blue = color.B;
    this.white = color.W;
  }

  sendColorToLamp(data, successCallback, failCallback){
    this.bleProvider.sendColor(data,successCallback,failCallback);
  }

  updateLampColor(color){    
    this.updateModelColors(color);
    this.sendColorToLamp(color,
      () => console.log("Updated with: " + JSON.stringify(color)),
      () => console.log("Error updating"));
  }

  setColor(event){
    this.updateLampColor({R: this.red, G: this.green, B:this.blue, W: this.white});
  }

  onPowerSwitchChange(event) {
    this.bleProvider.onOff(this.power);
  }
}
