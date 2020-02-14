import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BLE } from '@ionic-native/ble';

import { DuuuApp } from './app.component';
import { ConnectionPage } from '../pages/connection/connection';
import { ColorPickerPage } from '../pages/colorpicker/colorpicker';
import { HoneycombColorPicker } from '../components/honeycomb-color-picker/honeycomb-color-picker';
import { AnimationPicker } from '../components/animation-picker/animation-picker';
import { AnimationPage } from '../pages/animation/animation';
import { BluetoothProvider } from '../providers/bluetooth/bluetooth';

@NgModule({
  declarations: [
    DuuuApp,
    ConnectionPage,
    ColorPickerPage,
    HoneycombColorPicker,
    AnimationPicker,
    AnimationPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(DuuuApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DuuuApp,
    ConnectionPage,
    ColorPickerPage,
    AnimationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BLE,
    HoneycombColorPicker,
    AnimationPicker,
    BluetoothProvider
  ]
})
export class AppModule {}
