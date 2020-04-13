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
// ripple 
// ripple is a port of https://github.com/CodingTrain/website/blob/master/CodingChallenges/CC_102_WaterRipples/Processing/CC_102_WaterRipples/CC_102_WaterRipples.pde
let rows      = LUT_H;
let cols    = LUT_W;
let current   = array2D(LUT_W,LUT_H);
let previous  = array2D(LUT_W,LUT_H);

// setup keypress to test animations: Press ENTER from SSH to iterated through animations

function clearCanvas() {
  // clear frame with black pixels
  ctx.clearRect(0,0,LUT_W,LUT_H);
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,LUT_W,LUT_H);
}

const speed_to_velocity = (speed) => {return 1 + (speed/300) - 0.05};

function updateRipple(frame, ripple_speed = 1, pastel = 30, start, color = 'white') {
  const dampening = 0.99;
  const s_to_v = (speed_to_velocity(ripple_speed));

  if(frame % 60 === 0){
    // console.log(`updated frame: ${frame} - ${s_to_v}`)
    previous[start.x][start.y] =500;
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

      if (color === 'blue') {
        ctxData[index+0] = gray;
        ctxData[index+1] = gray;
        ctxData[index+2] = pastel;
        ctxData[index+3] = gray;
      }
      if (color === 'red') {
        ctxData[index+0] = pastel;
        ctxData[index+1] = gray;
        ctxData[index+2] = gray;
        ctxData[index+3] = gray;
      }

      if (color === 'green') {
        ctxData[index+0] = gray;
        ctxData[index+1] = pastel;
        ctxData[index+2] = gray;
        ctxData[index+3] = gray;
      }
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
function updateCircle(speed = 1, circleColor, start){
  const circle_speed = (Math.sin(frame * 0.01 * speed) + 1.0);
  ctx.strokeStyle = circleColor;
  ctx.strokeWeight=(2);
  ctx.beginPath();
  const r = circle_speed * 4;
  ctx.ellipse(start.x, start.y, r * HEX_HEIGHT_RATIO, r, 0, 0, 2 * Math.PI);
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

  // 2 is blue, 4 is red 5 is green 7 is pink 8 is rainbow
  if (
    animation_number === 2 ||
    animation_number === 4 ||
    animation_number === 5 ||
    animation_number === 7
  ) {
    let circleColor = '#0000EE';
    switch(animation_number) {
      case 4:
        circleColor = '#EE0000';
        break;
      case 5:
        circleColor = '#00EE00';
        break;
      case 7: 
        circleColor = '#EE0099';
        break;
    }
    const start = {x: (LUT_W * 0.5), y: (LUT_H * 0.5)};
    updateCircle(speed, circleColor, start);
  }

  // ripple
  if (animation_number === 3 || animation_number === 8 || animation_number === 9) {
    let start = { x: 12, y: 2 };
    let color = 'blue'
    let colorIntensity = 100
    if (animation_number === 8) {
      start = {x: 1, y: 1};
      color = 'red'
      colorIntensity = 70
    }
    if (animation_number === 9) {
      start = {x: 1, y: 10};
      color = 'green'
      colorIntensity = 90
    }
    updateRipple(frame, speed, colorIntensity, start, color);
  }
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
  console.log(`setting animation canvas ${JSON.stringify(pattern)}`);

  return setInterval(function () {
    updateCanvas(pattern);
    canvasToStrip(strip);
  }
  , 1000/30);
}

