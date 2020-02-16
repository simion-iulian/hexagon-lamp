const controller = require ('rpi-sk6812');
const NUM_LEDS = 96
const pixels = new Uint32Array(NUM_LEDS);

class Strip {
    constructor(){
        this.length = NUM_LEDS,
        this.pixels = pixels,
        controller.configure({"leds": this.length, "brightness": 255, "strip": "grbw" }),
        this.controller = controller
    }
    setPixel(index, color){
        this.pixels[index] = color;
    }
    render(){
        this.controller.render(this.pixels);
    }   
    reset(){
        this.controller.reset();
    }
    
    static convertRGBW2Int(r, g, b, w) {
        return ((w & 0xff) << 24) + 
               ((r & 0xff) << 16) + 
               ((g & 0xff) << 8) + 
               (b & 0xff);
      }
}
module.exports = Strip;