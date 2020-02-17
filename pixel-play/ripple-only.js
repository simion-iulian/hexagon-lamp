const ws281x = require('rpi-sk6812');
// copied just perlin noise from p5.js browser version and added minor tweaks for node (no Window required)
const p5               = require('./noise.js')

//Animations
//State 3 - Perlin
const MAX_LED_WIDTH = 8;
const NUM_LEDS = 96;
pixelData = new Uint32Array(NUM_LEDS);

let speed = 1

// ripple 
// ripple is a port of https://github.com/CodingTrain/website/blob/master/CodingChallenges/CC_102_WaterRipples/Processing/CC_102_WaterRipples/CC_102_WaterRipples.pde
let rows      = LUT_H;
let cols      = LUT_W;
let current   = new Array(NUM_LEDS).fill(0)
let previous  = new Array(NUM_LEDS).fill(0)
let dampening = 0.99;

const config =
{"leds" : 96,
"brightness" : 51,
"strip" : 'grbw' }

ws281x.configure(config);

function rgb2Int(r, g, b) {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

function ripple() {
  var offset = 0;
  var frame = 0;

  console.log("running rainbow");
  setInterval(function () {

    if(frame % 60 == 0){
      // speed means add more ripples
      for(let i = 0; i < speed; i++){
        let rx = Math.floor(2 + Math.random() * 4);
        let ry = Math.floor(2 + Math.random() * 4);
        let index = rx + ry * MAX_LED_WIDTH;
        index = Math.min(NUM_LEDS,Math.max(index,0));
        previous[index] = 500;
      }
    }

    for (let i = 1; i < rows-1; i++) {
      for (let j = 1; j < cols-1; j++) {
        current[i][j] = (previous[i-1][j] + previous[i+1][j] + previous[i][j-1] + previous[i][j+1]) * 0.5 - current[i][j];

        current[i][j] = current[i][j] * dampening;

        let index = (i + j * LUT_W) * 4;// RGBA
        let gray  = Math.floor(current[i][j]);

        ctxData[index+0] = gray;
        ctxData[index+1] = gray;
        ctxData[index+2] = gray;
        ctxData[index+3] = pastel;
      }
  }
  // swap buffers
  let temp = previous;
      previous = current;
      current = temp;
    

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

  , 1000/30);
}

ripple();