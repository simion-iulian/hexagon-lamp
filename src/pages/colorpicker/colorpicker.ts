import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { HoneycombColorPicker } from '../../components/honeycomb-color-picker/honeycomb-color-picker';
import { Color } from '../../components/color';
import { AnimationPage } from '../animation/animation';

// NeoPixel Service UUIDs
const NEOPIXEL_SERVICE = 'ccc0';
const COLOR = 'ccc1';
const POWER_SWITCH = 'ccc3';

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
      this.animationParams = {ble: this.ble, 
        device: this.peripheral, 
        neopixelService: NEOPIXEL_SERVICE}
    });

    // get the current values so we can sync the UI
    this.ble
      .read(peripheral.id, NEOPIXEL_SERVICE, COLOR)
      .then(buffer => {
            var data = new Uint8Array(buffer);
            this.ngZone.run(() => {
              const red = data[0], 
                  green = data[1], 
                   blue = data[2], 
                  white = data[3];
              const savedColor = new Color(red, green, blue, white)    
              this.updateLampColor(savedColor);
            });
          })
    .catch(err => {console.log("error reading setting to device state" + JSON.stringify(err))});

    this.ble
      .read(peripheral.id, NEOPIXEL_SERVICE, POWER_SWITCH)
      .then(buffer => {
        var data = new Uint8Array(buffer);
        console.log("Read Power Switch. Result: " + data[0]);
        this.ngZone.run(() => {
          this.power = data[0] !== 0;
        });
      });
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
    console.log('ionViewDidLoad ColorPickerPage');
  }

  disconnectLamp (){
    this.ble.disconnect(this.peripheral.id).then(
      () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
      () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
    )
  }
  ionViewWillLeave() {
    console.log('Leaving color picker page');
    // this.disconnectLamp();
  }

  colorToBluetoothData(color){
    return new Uint8Array([
      color.R, 
      color.G, 
      color.B, 
      color.W]).buffer;
  }

  sendColorToLamp(data, successCallback, failCallback){
    console.log("color peripheral")
    console.log(JSON.stringify(this.peripheral));

    this.ble
      .write(this.peripheral.id, NEOPIXEL_SERVICE, COLOR, data)
      .then(successCallback, failCallback);
  }

  updateModelColors(color) {
    this.red = color.R;
    this.green = color.G;
    this.blue = color.B;
    this.white = color.W;
  }

  updateLampColor(colorEvent){    

    let data = this.colorToBluetoothData(colorEvent);
    
    this.updateModelColors(colorEvent);
    this.sendColorToLamp(data,
      () => console.log("Updated with: " + JSON.stringify(colorEvent)),
      () => console.log("Error updating"));
  }

  setColor(event){
    this.updateLampColor({R: this.red, G: this.green, B:this.blue, W: this.white});
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
