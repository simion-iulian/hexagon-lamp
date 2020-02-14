const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(8, 16)
const ctx = canvas.getContext('2d')

ctx.fillStyle = 'black';
ctx.fillRect(0,0,8,16);
ctx.strokeStyle = 'gray';
ctx.strokeRect(1, 1, 7, 15);

console.log(ctx.getImageData(0,0,8,16));

const fs = require('fs')
const out = fs.createWriteStream(__dirname + '/test.png')
const stream = canvas.createPNGStream()
stream.pipe(out)
out.on('finish', () =>  console.log('The PNG file was created.'))