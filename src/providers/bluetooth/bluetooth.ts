import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';

// NeoPixel Service UUIDs
const NEOPIXEL_SERVICE = 'ccc0';
const COLOR = 'ccc1';
const PATTERN = 'ccc2';
const POWER_SWITCH = 'ccc3';

@Injectable()
export class BluetoothProvider {
  peripheral: any = {};
  toastCtrl: ToastController;

  constructor(private ble: BLE) {
    console.log('Bluetooth Provider Instantiated');
  }

  connectDevice(device) {
    console.log('Creating device connection')
    this.ble.connect(device.id).subscribe(
      peripheral => this.onConnected(peripheral),
      peripheral => this.onDeviceDisconnected(peripheral)
    );
  }

  onConnected(peripheral){
    this.peripheral = peripheral;
  }

  onDeviceDisconnected(peripheral) {
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

  colorToBluetoothData(color){
    return new Uint8Array([
      color.R, 
      color.G, 
      color.B, 
      color.W]).buffer;
  }

  sendColor(color, successCallback, failCallback){
    const data = this.colorToBluetoothData(color)
    this.ble
      .write(this.peripheral.id, NEOPIXEL_SERVICE, COLOR, data)
      .then(successCallback, failCallback);
  }

  setPattern(pattern, success, fail){
    console.log("setting patter in provider" + JSON.stringify(pattern));
    let data = new Uint8Array([1]);
    this.ble
      .write(this.peripheral.id, NEOPIXEL_SERVICE, PATTERN, data.buffer)
      .then(success,fail);
  }

  onOff(power){
    let value = power ? 1 : 0;
    let data = new Uint8Array([value]);
     
    this.ble.write(this.peripheral.id, NEOPIXEL_SERVICE, POWER_SWITCH, data.buffer).then(
      () => { console.log('Updated power switch')},
      () => {console.log('Error updating  power switch')}
    );
  }
}
