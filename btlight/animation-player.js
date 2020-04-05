const Strip = require('./strip-controller');
const {updateCanvasAnimations} = require ('./animation-canvas')

class AnimationPlayer {
    constructor(strip) {
        this.strip = strip;
        this.animationInterval = {};
        this.isPlaying = false;
    }

    // Public interface to use the player
    play(pattern) {
        if(this.isPlaying == true){
            clearInterval(this.animationInterval);
        }
        console.log("Animation player pattern: " + JSON.stringify(pattern))    
        switch(pattern.number) {
            case 1:
                this.rainbow(pattern.speed);
                break;
            default: 
                this.updateCanvasAnimations(this.strip, pattern);
                break;
        }
        this.isPlaying = true;
    }

    stop(){
        clearInterval(this.animationInterval);
        this.isPlaying = false;
    }

    // Private methods to be used for animating
    colorwheel (pos, pastel) {
        const rgb2Int = (r, g, b) => { return Strip.convertRGBW2Int(r,g,b, pastel);}
        pos = 255 - pos;
        if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
        else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
        else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
    }

    rainbow(speed, pastel = 0){
        var offset = 0;
        const strip = this.strip;
        const colorwheel = this.colorwheel;
        this.animationInterval = setInterval(function () 
            {
              for (let i = 0; i < strip.length; i++) {
              strip.setPixel(i, colorwheel((offset + i) % 256, pastel, strip));
            }
        offset = (offset + speed) % 256;
        
        strip.render()
        }, 1000/30);
    }
    updateCanvasAnimations(strip, pattern){
        this.animationInterval = updateCanvasAnimations(strip, pattern);
    }
}

module.exports = AnimationPlayer;