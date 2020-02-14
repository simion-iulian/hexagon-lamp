import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';

// NeoPixel Service UUIDs
const NEOPIXEL_SERVICE = 'ccc0';
const COLOR = 'ccc1';
const POWER_SWITCH = 'ccc3';

@Injectable()
export class BluetoothProvider {
  peripheral: any = {};
  toastCtrl: ToastController;

  constructor(private ble: BLE) {
    console.log('Hello Bluetooth Provider');
  }

  addDeviceToProvider(device) {
    console.log("connecting to in provider" + JSON.stringify(device))
    this.ble.connect(device.id).subscribe(
      peripheral => this.onConnected(peripheral),
      peripheral => this.onDeviceDisconnected(peripheral)
    );
  }

  onConnected(peripheral){
    console.log("connected to in provider" + JSON.stringify(peripheral))
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

  sendColor(data, successCallback, failCallback){
    console.log("provider sending color" + JSON.stringify(data) + "to" + (JSON.stringify(this.peripheral)));
    this.ble
      .write(this.peripheral.id, NEOPIXEL_SERVICE, COLOR, data)
      .then(successCallback, failCallback);
  }
}
