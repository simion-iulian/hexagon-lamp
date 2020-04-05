const bleno = require('bleno');

const serviceSettings = {
    service_id: 'ccc0',
    characteristic_id: '2901'
  };  
const switchSettings = {
  service_id:'ccc3',
  characteristic_id:'2901'
};

const patternSettings = {
  service_id:'ccc2',
  characteristic_id:'2901'
};

const colorSettings = {
  service_id:'ccc1',
  characteristic_id:'2901'
};

class SwitchCharacteristic extends bleno.Characteristic {
    constructor(uuid, name, lamp) {
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
        this.lamp = lamp;
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
            this.lamp.state.settings.power = this.argument;
            this.lamp.loadState();
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

module.exports = SwitchCharacteristic;

