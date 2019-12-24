import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { HoneycombColorPicker } from '../../components/honeycomb-color-picker/honeycomb-color-picker';
import { Color } from '../../components/color';

// NeoPixel Service UUIDs
const NEOPIXEL_SERVICE = 'ccc0';
const COLOR = 'ccc1';
const BRIGHTNESS = 'ccc2';
const POWER_SWITCH = 'ccc3';
const PATTERN = 'ccc4';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  currentColor: Color;
  peripheral: any = {};
  colorPicker : HoneycombColorPicker;
  white: number;
  brightness: number;
  pattern: number;
  speed: number;
  power: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private ble: BLE,
              private toastCtrl: ToastController,
              private ngZone: NgZone) {
    let device = navParams.get('device');
    this.ble.connect(device.id).subscribe(
      peripheral => this.onConnected(peripheral),
      peripheral => this.onDeviceDisconnected(peripheral)
    );
  }

  onConnected(peripheral) {
    console.log('Connected to ' + peripheral.name + ' ' + peripheral.id);
    this.ngZone.run(() => {
      this.peripheral = peripheral;
    });

    // get the current values so we can sync the UI
    this.ble.read(peripheral.id, NEOPIXEL_SERVICE, COLOR).then(
      buffer => {
        var data = new Uint8Array(buffer);
        this.ngZone.run(() => {
          const red = data[0], 
              green = data[1], 
               blue = data[2], 
              white = data[3];
          const savedColor = new Color(red, green, blue, white)    
          this.currentColor = savedColor;
          this.updateLampColor(savedColor);
        });
      }
    );

    this.ble.read(peripheral.id, NEOPIXEL_SERVICE, BRIGHTNESS).then(
      buffer => {        
        var data = new Uint8Array(buffer);
        this.ngZone.run(() => {
          this.brightness = data[0];
        });
      }
    );

    this.ble.read(peripheral.id, NEOPIXEL_SERVICE, POWER_SWITCH).then(
      buffer => {
        var data = new Uint8Array(buffer);
        console.log('Read Power Switch. Result: ' + data[0]);
        this.ngZone.run(() => {
          this.power = data[0] !== 0;
        });
      }
    );
  }

  onDeviceDisconnected(peripheral) {
    let toast = this.toastCtrl.create({
      message: 'The peripheral unexpectedly disconnected',
      duration: 3000,
      position: 'center'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      // TODO navigate back?
    });

    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave disconnecting Bluetooth');
    this.ble.disconnect(this.peripheral.id).then(
      () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
      () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
    )
  }

  colorToBluetoothData(color){
    return new Uint8Array([
      color.R, 
      color.G, 
      color.B, 
      color.W]).buffer;
  }

  sendColorToLamp(data, successCallback, failCallback){
    this.ble
      .write(this.peripheral.id, NEOPIXEL_SERVICE, COLOR, data)
      .then(successCallback, failCallback );
  }

  updateLampColor(colorEvent){    
    console.log("color from event" + JSON.stringify(colorEvent));

    this.currentColor = new Color(
        colorEvent.R, 
        colorEvent.G, 
        colorEvent.B, 
        colorEvent.W)

    let data = this.colorToBluetoothData(colorEvent);
    this.sendColorToLamp(data,
      () => console.log("Updated with: " + JSON.stringify(data)),
      () => console.log("Error updating"));
  }

  setColor(event){
    this.updateLampColor({R: 0, G: 0, B:0, W: this.white});
  }

  setPattern(event){
    console.log("Selecting pattern: " + this.pattern)
    let data = new Uint8Array([this.pattern])
    this.ble.write(this.peripheral.id, NEOPIXEL_SERVICE, PATTERN, data.buffer).then(
      () => console.log('Updated pattern'),
      () => console.log('Error updating pattern')
    );
  }

  setBrightness(event){
    console.log('setBrightness');
    let data = new Uint8Array([this.brightness]);
    this.ble.write(this.peripheral.id, NEOPIXEL_SERVICE, BRIGHTNESS, data.buffer).then(
      () => console.log('Updated brightness'),
      () => console.log('Error updating brightness')
    );
  }

  onPowerSwitchChange(event) {
    console.log('onPowerSwitchChange');
    let value = this.power ? 1 : 0;
    let data = new Uint8Array([value]);
    console.log('Power Switch Property ' + this.power);
    this.ble.write(this.peripheral.id, NEOPIXEL_SERVICE, POWER_SWITCH, data.buffer).then(
      () => {
        console.log('Updated power switch')
        if (this.power && this.brightness === 0) {
          this.brightness = 0x3f; // cheating, should rely on notification
        }
      },
      () => console.log('Error updating  power switch')
    );
  }
}
