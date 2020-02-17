const controller = require ('rpi-sk6812');

class Strip {
    constructor(){
        this.length = 96,
        this.pixels = new Uint32Array(this.length);
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