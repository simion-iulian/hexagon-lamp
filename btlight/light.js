const bleno = require('bleno');
const stripController = require('rpi-sk6812');
const AnimationPlayer = require('./animation-player.js');


let lampState = {
  "name":"Heks",
	"settings":{
    "r":0,
		"g":0,
    "b":0,
    "w":100,
		"pattern":1,
		"power":0,
		"brightness":226
	}
}

let r,
g,
b,
patternState,
switchState,
bright;

console.log(JSON.stringify(lampState));

const NUM_LEDS = 96, 
pixelData = new Uint32Array(NUM_LEDS);

const strip = {
  controller: stripController,
  leds: NUM_LEDS,
  pixels: new Uint32Array(NUM_LEDS)
}


const config =
{"leds" : NUM_LEDS,
"brightness" : 255,
"strip" : 'grbw' }

stripController.configure(config);
let animationPlayer = new AnimationPlayer(strip);

const lampName = lampState.name;
 r = lampState.settings.r;
 g = lampState.settings.g;
 b = lampState.settings.b;
 w = lampState.settings.w;
 patternState = lampState.settings.pattern;
 switchState = lampState.settings.power;

// ---- trap the SIGINT and reset before exit
// TODO: forgot to close the bluetooth when I close the app. Better to clean-up that connection too
process.on('SIGINT', function () {
  stripController.reset();
  process.nextTick(function () { process.exit(0); });
});


function loadState(){
  //Load the inital settings? I make a call right after this.
  r = lampState.settings.r;
  g = lampState.settings.g;
  b = lampState.settings.b;
  patternState = lampState.settings.pattern;
  switchState = lampState.settings.power;
  if(switchState == 1) {
    for(var i = 0; i<NUM_LEDS;i++)
      pixelData[i] = rgb2Int(r,g,b);
  }
  else {
    for(var i = 0; i<NUM_LEDS;i++)
    pixelData[i] = 0x000000;
  }
  stripController.render(pixelData);
}

loadState();

function saveState(){
  lampState.settings.r = r;
  lampState.settings.g = g;
  lampState.settings.b = b;
  lampState.settings.pattern = patternState;
  lampState.settings.power = switchState;
}

// Bluetooth service/characteristic things
// What's the relationship between the services and characteristics?

var serviceSettings = {
  service_id: 'ccc0',
  characteristic_id: '2901'
};

var switchSettings = {
  service_id:'ccc3',
  characteristic_id:'2901'
};

var patternSettings = {
  service_id:'ccc2',
  characteristic_id:'2901'
};

var colorSettings = {
  service_id:'ccc1',
  characteristic_id:'2901'
};

//I'm using TypeScript and I even didn't know it
class SwitchCharacteristic extends bleno.Characteristic {
  constructor(uuid, name) {
      super({
          uuid: uuid,
          properties: ["write","read", "notify"],
          value: null,
          descriptors: [
              new bleno.Descriptor({
                  uuid: "2901",
                  value: name
                })
          ]
      });
      this.argument = 0;
      this.name = name;
  }

  onWriteRequest(data, offset, withoutResponse, callback) {
      try {
          if(data.length != 1) {
              callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
              return;
          }
          this.argument = data.readUInt8();
          var status = this.argument === 0 ? "Off" : "On";
          console.log(`${this.name} is now ${status}`);
          lampState.settings.power = this.argument;
          loadState();
          callback(this.RESULT_SUCCESS);
      } catch (err) {
          console.error(err);
          callback(this.RESULT_UNLIKELY_ERROR);
      }
  }
  onReadRequest(offset, callback) {
    try {
        let data = new Buffer(lampState.settings.power);
        callback(this.RESULT_SUCCESS, data);
    } catch (err) {
        console.error(err);
        callback(this.RESULT_UNLIKELY_ERROR);
    }
  }
}

class ColorCharacteristic extends bleno.Characteristic {
  constructor(uuid, name) {
      super({
          uuid: uuid,
          properties: ["write","read", "notify"],
          value: null,
          descriptors: [
              new bleno.Descriptor({
                  uuid: "2901",
                  value: name
                })
          ]
      });
      this.argument = 0;
      this.name = name;
  }
  onWriteRequest(data, offset, withoutResponse, callback) {
     console.log("["+data[0]+"]["+data[1]+"]["+data[2]+"]["+data[3]+"]");

    try {
      data = new Uint16Array(data)
      if(data.length != 4) {
          callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
          return;
      }

      if(animationPlayer.isPlaying)
        animationPlayer.stop();

      this.argument=data
      console.log(`${this.name} is ${this.argument}`);
      for(var i = 0; i<NUM_LEDS;i++){
        r = data[0];
        g = data[1];
        b = data[2];
        w = data[3];
        pixelData[i] = rgbw2Int(r,g,b,w);
      }
      stripController.render(pixelData);
      saveState();
      callback(this.RESULT_SUCCESS);
      } catch (err) {
          console.error(err);
          callback(this.RESULT_UNLIKELY_ERROR);
      }
  }
  onReadRequest(offset, callback) {
    try {
        let data = new Buffer([r,g,b]);
        callback(this.RESULT_SUCCESS, data);
    } catch (err) {
        console.error(err);
        callback(this.RESULT_UNLIKELY_ERROR);
    }
  }
}

class PatternCharacteristic extends bleno.Characteristic {
  constructor(uuid, name) {
      super({
          uuid: uuid,
          properties: ["write", "read", "notify"],
          value: null,
          descriptors: [
              new bleno.Descriptor({
                  uuid: "2901",
                  value: name
                })
          ]
      });
      this.argument = 0;
      this.name = name;
      console.log("created Pattern characteristic");
  }
  onWriteRequest(data, offset, withoutResponse, callback) {
    try {
      if(data.length != 1) {
        callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
        return;
      }
      this.argument = data.readUInt8()
      patternState = this.argument
      // clearIntervals();
      switch(patternState){
        case 1:{
          console.log("changing to " + patternState);
          animationPlayer.play(patternState);
        }
      }
      saveState();
      callback(this.RESULT_SUCCESS);
      } catch (err) {
          console.error(err);
          callback(this.RESULT_UNLIKELY_ERROR);
      }
  }
  onReadRequest(offset, callback) {
    try {
        let data = new Buffer([bright]);
        callback(this.RESULT_SUCCESS, data);
    } catch (err) {
        console.error(err);
        callback(this.RESULT_UNLIKELY_ERROR);
    }
  }
}


let switchCharacteristic = new SwitchCharacteristic(switchSettings.service_id, "Switch");
let patternCharacteristic = new PatternCharacteristic(patternSettings.service_id, "Pattern");
let colorCharacteristic = new ColorCharacteristic(colorSettings.service_id,  "Color (24-bit)");

var neopixelService =  new bleno.PrimaryService({
  uuid: serviceSettings.service_id,
  characteristics: [
   switchCharacteristic,
   patternCharacteristic,
   colorCharacteristic
  ]
})

bleno.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    bleno.startAdvertising(lampName, ["ccc0"]);
    console.log("Bluetooth On");
  } else {
    bleno.stopAdvertising();
  }
});

// Notify the console that we've accepted a connection
bleno.on('accept', function(clientAddress) {
  console.log("Accepted connection from address: " + clientAddress);
  loadState();
});

// Notify the console that we have disconnected from a client
bleno.on('disconnect', function(clientAddress) {
  console.log("Disconnected from address: " + clientAddress);
  saveState();
});

bleno.on('advertisingStart', function(error) {
  console.log("Advertising Started");
  if (error) {
    // error on advertise start
    console.log("Error: " + error);
  } else {
    console.log('started...');
    //console.log(bleno);
    bleno.setServices([
      neopixelService
    ]);
  }
});

bleno.on("servicesSet", err => {
  console.log("Bleno: servicesSet")
});

bleno.on("servicesSetError", err => console.log("Bleno: servicesSetError"));

//Animations
//State 1 - Rainbow

function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

function rgbw2Int(r, g, b, w) {
  return ((w & 0xff) << 24) + 
         ((r & 0xff) << 16) + 
         ((g & 0xff) << 8) + 
         (b & 0xff);
}
