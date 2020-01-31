const controller = require ('rpi-sk6812');

class Strip {
    constructor(){
        this.leds = 96,
        this.pixels = new Uint32Array(this.leds),
        controller.configure({"leds": this.leds, "brightness": 255, "strip": "grbw" }),
        this.controller = controller
    }
    setPixel(index, color){
        this.pixels[index] = color;
    }
    render(pixels){
        this.controller.render(pixels);
    }   
    reset(){
        this.controller.reset();
    }
}
module.exports = Strip;