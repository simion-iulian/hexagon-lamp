class AnimationPlayer {
    constructor(strip){
        this.strip = strip
        this.animationInterval = {}
        this.isPlaying = true;
    }

    // Public interface to use the player
    play(pattern){
        this.isPlaying = true;
        switch(pattern){
            case 1:
                this.rainbow();
        }
    }

    stop(){
        clearInterval(this.animationInterval);
        this.isPlaying = false;
    }

    // Private methods to be used for animating

    colorwheel (pos) {
        const rgb2Int = (r, g, b) => {
            return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
        }
        pos = 255 - pos;
        if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
        else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
        else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
    }

    rainbow(){
        var offset = 0;
        const strip = this.strip;
        const colorwheel = this.colorwheel;
        let pixels = strip.pixels;
        this.animationInterval = setInterval(function () 
            {
              for (let i = 0; i < strip.leds; i++) {
              pixels[i] = colorwheel((offset + i) % 256);
            }
        offset = (offset + 1) % 256;
        
        strip.controller.render(pixels)
        }, 1000/30);
    }
}

module.exports = AnimationPlayer;