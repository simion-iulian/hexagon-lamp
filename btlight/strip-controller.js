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
}
module.exports = Strip;