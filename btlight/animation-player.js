class AnimationPlayer {
    constructor(strip){
        this.strip = strip,
        this.animationInterval = {},
        this.isPlaying = false;
    }

    // Public interface to use the player
    play(pattern) {
        if(this.isPlaying == true)
            clearInterval(this.animationInterval);

        console.log("Animation player pattern: " + JSON.stringify(pattern))    
        switch(pattern.pattern_number) {
            case 1:
                this.rainbow(pattern.speed);
        }

        this.isPlaying = true;
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

    rainbow(speed = 1){
        var offset = 0;
        const strip = this.strip;
        const colorwheel = this.colorwheel;
        this.animationInterval = setInterval(function () 
            {
              for (let i = 0; i < strip.length; i++) {
              strip.setPixel(i, colorwheel((offset + i) % 256));
            }
        offset = (offset + speed) % 256;
        
        strip.render()
        }, 1000/30);
        
    }
}

module.exports = AnimationPlayer;