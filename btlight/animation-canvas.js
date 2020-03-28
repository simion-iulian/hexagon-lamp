const { createCanvas } = require('canvas')
// copied just perlin noise from p5.js browser version and added minor tweaks for node (no Window required)
const p5               = require('./noise.js')
// https://en.wikipedia.org/wiki/Hexagon#Parameters
// "a hexagon with a long diagonal of 1.0000000 will have a distance of 0.8660254 between parallel sides."
// this is handy to scale content on Y so it appears 1:1 on the hexagon, notice the hexagon in the LUT if you squint your eyes is not a 1:1 rectangle
// const HEX_HEIGHT_RATIO = 0.8660254;
const HEX_HEIGHT_RATIO = 0.8128988125;
// full canvas dimensions
const LUT_W = 15;
const LUT_H = 16;
// full canvas including missing pixels (marked as -1)
// LUT currently nased of prototype (2:1 ratio, skipping every other pixel)
const LUT = [
 -1,-1,-1,-1, 0,-1, 1,-1, 2,-1, 3,-1,-1,-1,-1,
 -1,-1,-1, 8,-1, 7,-1, 6,-1, 5,-1, 4,-1,-1,-1,
 -1,-1,-1, 9,-1,10,-1,11,-1,12,-1,13,-1,-1,-1,
 -1,-1,19,-1,18,-1,17,-1,16,-1,15,-1,14,-1,-1,
 -1,-1,20,-1,21,-1,22,-1,23,-1,24,-1,25,-1,-1,
 -1,32,-1,31,-1,30,-1,29,-1,28,-1,27,-1,26,-1,
 -1,33,-1,34,-1,35,-1,36,-1,37,-1,38,-1,39,-1,
 47,-1,46,-1,45,-1,44,-1,43,-1,42,-1,41,-1,40,
 48,-1,49,-1,50,-1,51,-1,52,-1,53,-1,54,-1,55,
 -1,62,-1,61,-1,60,-1,59,-1,58,-1,57,-1,56,-1,
 -1,63,-1,64,-1,65,-1,66,-1,67,-1,68,-1,69,-1,
 -1,-1,75,-1,74,-1,73,-1,72,-1,71,-1,70,-1,-1,
 -1,-1,76,-1,77,-1,78,-1,79,-1,80,-1,81,-1,-1,
 -1,-1,-1,86,-1,85,-1,84,-1,83,-1,82,-1,-1,-1,
 -1,-1,-1,87,-1,88,-1,89,-1,90,-1,91,-1,-1,-1,
 -1,-1,-1,-1,95,-1,94,-1,93,-1,92,-1,-1,-1,-1,
]

const LUT_LENGTH = LUT.length;
// the canvas to draw into
const canvas = createCanvas(LUT_W, LUT_H)
// the canvas context
const ctx = canvas.getContext('2d')
// to be passed by AnimationPlayer/etc.
let pastel = 10;
// animation tests
let frame = 0;
let txt = 'Hello !';
let gradient;
// perlin animation vars
// animation is a port of https://processing.org/examples/noise3d.html
let increment = 0.01;
// The noise function's 3rd argument, a global variable that increments once per cycle
let zoff = 0.0;
// We will increment zoff differently than xoff and yoff
let zincrement = 0.02; 
// ripple 
// ripple is a port of https://github.com/CodingTrain/website/blob/master/CodingChallenges/CC_102_WaterRipples/Processing/CC_102_WaterRipples/CC_102_WaterRipples.pde
let rows      = LUT_H;
let cols    = LUT_W;
let current   = array2D(LUT_W,LUT_H);
let previous  = array2D(LUT_W,LUT_H);

// setup keypress to test animations: Press ENTER from SSH to iterated through animations

// Canvas setup
function setupCanvas(){
  // you can use most Canvas function so easy text/css colours (e.g. rgb(r,g,b), rgba(r,g,b,1.0), hsl(), etc.)
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,LUT_W,LUT_H);
  ctx.font = '12px serif';
  scrollW = ctx.measureText(txt).width;
  gradient = ctx.createLinearGradient(0, 0, LUT_W, 0);
  // rainbow gradient ROGVAIV / ROYGBIV
  let step = 1.0 / 7.0;
  gradient.addColorStop(step * 0,"red");
  gradient.addColorStop(step * 1,"orange");
  gradient.addColorStop(step * 2,"yellow");
  gradient.addColorStop(step * 3,"green");
  gradient.addColorStop(step * 4,"blue");
  gradient.addColorStop(step * 5,"indigo");
  gradient.addColorStop(step * 6,"violet");
  ctx.fillStyle = gradient;
}

function clearCanvas() {
  // clear frame with black pixels
  ctx.clearRect(0,0,LUT_W,LUT_H);
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,LUT_W,LUT_H);
}

function updatePerlin(speed = 1) {
  // get pixels
  let ctxImageData = ctx.getImageData(0,0,LUT_W,LUT_H);
  let ctxData = ctxImageData.data;
  
  // Optional: adjust noise detail here
  // speed means faster and more complex noise pattern
  p5.noiseDetail(2 + speed,.61803398875);
    
  let xoff = 0.0; // Start xoff at 0
    
  // For every x,y coordinate in a 2D space, calculate a noise value and produce a brightness value
  for (let x = 0; x < LUT_W; x++) {
    xoff += increment;   // Increment xoff 
    let yoff = 0.0;   // For every xoff, start yoff at 0
    for (let y = 0; y < LUT_H; y++) {
      yoff += increment; // Increment yoff
      
      // Calculate noise and scale by 255
      let bright = p5.noise(xoff,yoff,zoff)*255;

      // Try using this line instead
      //float bright = random(0,255);
      let index = (x + y * LUT_W) * 4;// RGBA
      let gray  = Math.floor(bright);
      // Set each pixel onscreen to a grayscale value
      ctxData[index+0] = gray;//R
      ctxData[index+1] = gray;//G
      ctxData[index+2] = gray;//B
      ctxData[index+3] = pastel;//W
      
    }
  }
  
  zoff += zincrement; // Increment zoff
  // set pixels
  ctx.putImageData(ctxImageData,0,0);
}

const speed_to_velocity = (speed) => {return 1 + (speed/100) - 0.05};

function updateRipple(frame, ripple_speed = 1, pastel = 30) {
  const dampening = 0.99;
  const s_to_v = (speed_to_velocity(ripple_speed/3));
  
  if(frame % 60 == 0){
    console.log(`updated frame: ${frame} - ${s_to_v}`)
    previous[7][8] =500;
  }
  
  let ctxImageData = ctx.getImageData(0,0,LUT_W,LUT_H);
  let ctxData = ctxImageData.data;
  
  for (let i = 1; i < rows-1; i++) {
    for (let j = 1; j < cols-1; j++) {

        const smoothed = (previous[i-1][j] + 
                          previous[i+1][j] + 
                          previous[i][j-1] + 
                          previous[i][j+1])/4;

        const velocity = (- current[i][j])*s_to_v;

        current[i][j] = smoothed*2 + velocity;

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

  ctx.putImageData(ctxImageData,0,0);
}
// makes a 2D array of zeros
function array2D(cols,rows){
  let result = new Array(rows);
  for (var y = 0; y < rows; y++) {
    result[y] = new Array(cols).fill(0);
  }
  return result;
}
function updateCircle(speed = 1 , pastel = 0){
  const circle_speed = (Math.sin(frame * 0.01 * speed) + 1.0);
  ctx.strokeStyle = '#000099';
  ctx.beginPath();
  const r = circle_speed * 4;
  ctx.ellipse(LUT_W * 0.5, LUT_H * 0.5, r * HEX_HEIGHT_RATIO, r, 0, 0, 2 * Math.PI);
  //ctx.ellipse(LUT_W * 0.5, LUT_H * 0.5, r, r, 0, 0, 2 * Math.PI);
  ctx.stroke();
}
// main render loop for canvas animations
function updateCanvas(pattern) {
  const animation_number = pattern.number;
  const speed = pattern.speed
  // console.log(typeof animation_number)

  frame++;
  clearCanvas();
  // circle test
  pastel = (pattern.enable_pastel == 0) ? 20 : 0

  if(animation_number == 2) {
   updateCircle(speed, pastel);
  }

  // ripple
  if(animation_number == 3){
    updateRipple(frame, speed);
  }

  // // perlin
  // if(animation_number == 4){
  //   updatePerlin(frame);
  // }
}

// pull canvas pixels and update strip
function canvasToStrip(strip) {
  // get all pixels
  let ctxData = ctx.getImageData(0,0,LUT_W,LUT_H).data;
  // for each pixel in the lookup  
  for(var pixelIndex = 0, ctxIndex = 0; pixelIndex < LUT_LENGTH; pixelIndex++, ctxIndex += 4){
    // check if it's an addressed LED (not masked by -1)
    if(LUT[pixelIndex] >= 0){
      // pull pixel value
      let r = ctxData[ctxIndex];
      let g = ctxData[ctxIndex+1];
      let b = ctxData[ctxIndex+2];
      let w = pastel // ctxData[ctxIndex+3];
      let rgbw = (w << 24) | (r << 16) | (g << 8) | b;
      // update pixel data
      strip.setPixel(LUT[pixelIndex], rgbw);
    }
  }
  // display mapped pixel data on LEDs
  strip.render();
}

exports.updateCanvasAnimations =  (strip, pattern) => {
  setupCanvas();
  console.log(`setting animation canvas ${JSON.stringify(pattern)}`);

  return setInterval(function () {
    const start = Date.now();
    
    updateCanvas(pattern);
    canvasToStrip(strip);
    // console.log(`took ${Date.now() - start} to push to strip`)  
  }
  , 1000/30);
}


