const bleno = require('bleno');
const Strip = require('./strip-controller');
const AnimationPlayer = require('./animation-player.js');

const strip = new Strip();
const lampName = "Heks";
let lampState = {
  "r":0,
  "g":0,
  "b":0,
  "w":100,
  "pattern":1,
  "speed": 1,
  "power":0,
}

console.log(JSON.stringify(lampState));
const animationPlayer = new AnimationPlayer(strip);

// ---- trap the SIGINT and reset before exit
// TODO: forgot to close the bluetooth when I close the app. Better to clean-up that connection too
process.on('SIGINT', function () {
  strip.reset();
  process.nextTick(function () { process.exit(0); });
});

function loadState() {
  const r = lampState.r, g = lampState.g, b = lampState.b, w = lampState.w,
  patternState = lampState.pattern,
  switchState = lampState.power;
  if(switchState == 1) {
    for(var i = 0; i < strip.length;i++)
      strip.setPixel(i, rgbw2Int(r,g,b,w));
  }
  else {
    for(var i = 0; i<strip.length;i++)
    strip.setPixel(i, 0x000000);
  }
  strip.render();
}

loadState();

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
          lampState.power = this.argument;
          loadState();
          callback(this.RESULT_SUCCESS);
      } catch (err) {
          console.error(err);
          callback(this.RESULT_UNLIKELY_ERROR);
      }
  }
  onReadRequest(offset, callback) {
    try {
        let data = new Buffer(lampState.power);
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
      for(var i = 0; i<strip.length;i++) {
        const r = data[0], g = data[1], b = data[2], w = data[3];
        strip.setPixel(i, rgbw2Int(r,g,b,w));
        lampState.r = r; lampState.g = g; lampState.b = b; lampState.w = w;
      }
      strip.render();
      callback(this.RESULT_SUCCESS);
      } catch (err) {
          console.error(err);
          callback(this.RESULT_UNLIKELY_ERROR);
      }
  }
  onReadRequest(offset, callback) {
    try {
        console.log(`sending data to app`)
        let data = new Buffer([lampState.r,lampState.g,lampState.b, lampState.w]);
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
      this.name = name;
      console.log("created Pattern characteristic");
  }
  onWriteRequest(data, offset, withoutResponse, callback) {
    console.log("pattern change");
    console.log(JSON.stringify(data));
    console.log("length: " + data.length);
    try {
      // if(data.length != 1) {
      //   callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
      //   return;
      // }

      const pattern = {
        "number": data[0],
        "speed" : data[1],
        "enable_pastel" : data[2]
      }

      animationPlayer.play(pattern);

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
