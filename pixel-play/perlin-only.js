const ws281x = require('rpi-sk6812');
// copied just perlin noise from p5.js browser version and added minor tweaks for node (no Window required)
const p5               = require('./noise.js')

//Animations
//State 3 - Perlin
const MAX_LED_WIDTH = 8;
const NUM_LEDS = 96;
pixelData = new Uint32Array(NUM_LEDS);

let speed = 1;

// perlin animation vars
// animation is a port of https://processing.org/examples/noise3d.html
let increment = 0.01;
// The noise function's 3rd argument, a global variable that increments once per cycle
let zoff = 0.0;
// We will increment zoff differently than xoff and yoff
let zincrement = 0.02; 

const config =
{"leds" : 96,
"brightness" : 51,
"strip" : 'grbw' }

ws281x.configure(config);

function rgb2Int(r, g, b) {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

function perlin() {
  var offset = 0;
  console.log("running rainbow");
  setInterval(function () {

    // Optional: adjust noise detail here
    // speed means faster and more complex noise pattern
    p5.noiseDetail(2 + speed,.61803398875);
      
    let xoff = 0.0; // Start xoff at 0
    

    for(var i = 0; i < NUM_LEDS; i++) {
      
      // guesstimate x,y location without a lookup (ignoring snake indexing)
      var x = Math.floor(i % MAX_LED_WIDTH);
      var y = Math.floor(i / MAX_LED_WIDTH);

      xoff += increment;   // Increment xoff 
      let yoff = 0.0;   // For every xoff, start yoff at 0
      yoff += increment; // Increment yoff

      // Calculate noise and scale by 255
      let bright = p5.noise(xoff,yoff,zoff)*255;
      let gray  = Math.floor(bright);

      // play with R,G,B mapping here
      pixelData[i] = rgb2Int(gray,gray,gray);      

    }
    
    
    ws281x.render(pixelData)}

  , 1000/60);
}

perlin();
