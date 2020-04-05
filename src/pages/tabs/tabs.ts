import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  picker_tab = 'PickerTabPage';
  animations_tab = 'AnimationTabPage'
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private ble: BluetoothProvider) {
  }

  ionViewDidLoad() {
    console.log(`tabs loaded ${Date.now()}`);
  }

  ionViewWillLeave() {
    this.ble.disconnectDevice();
  }
}
