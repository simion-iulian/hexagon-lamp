const ws281x = require('rpi-sk6812');

//Animations
//State 1 - Rainbow

const NUM_LEDS = 96;
pixelData = new Uint32Array(NUM_LEDS);


const config =
{"leds" : 96,
"brightness" : 255,
"strip" : 'grbw' }

ws281x.configure(config);

function rgb2Int(r, g, b) {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

function rainbow() {
  var offset = 0;
  console.log("running rainbow");
  setInterval(function () {
  for(var i = 0; i < NUM_LEDS; i++) {
    pixelData[i] = colorwheel((offset + i) % 256);
  }
  offset = (offset + 1) % 256;
  ws281x.render(pixelData)}
  , 1000/30);
}

function colorwheel(pos) {
  pos = 255 - pos;
  if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
  else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
  else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}

rainbow();