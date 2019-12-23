import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BLE } from '@ionic-native/ble';

import { DuuuApp } from './app.component';
import { ConnectionPage } from '../pages/connection/connection';
import { DetailPage } from '../pages/detail/detail';
import { ColorSliderModule } from 'ngx-color/slider';

@NgModule({
  declarations: [
    DuuuApp,
    ConnectionPage,
    DetailPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(DuuuApp),
    ColorSliderModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DuuuApp,
    ConnectionPage,
    DetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BLE
  ]
})
export class AppModule {}
