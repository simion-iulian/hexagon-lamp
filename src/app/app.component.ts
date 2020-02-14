import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BLE } from '@ionic-native/ble';
import { BluetoothProvider } from '../providers/bluetooth/bluetooth'

import { ConnectionPage } from '../pages/connection/connection';
@Component({
  templateUrl: 'app.html'
})
export class DuuuApp {
  rootPage:any = ConnectionPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, ble: BLE, bleProvider: BluetoothProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

