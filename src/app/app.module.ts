import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BLE } from '@ionic-native/ble';

import { DuuuApp } from './app.component';
import { ConnectionPage } from '../pages/connection/connection';

import { TabsPage } from '../pages/tabs/tabs';

import { BluetoothProvider } from '../providers/bluetooth/bluetooth';

@NgModule({
  declarations: [
    DuuuApp,
    ConnectionPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(DuuuApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DuuuApp,
    ConnectionPage,
    TabsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BLE,
    BluetoothProvider
  ]
})
export class AppModule {}
