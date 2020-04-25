const { updateCanvasAnimations } = require('./animation-canvas')
const Strip = require('./strip-controller')
const args = require('yargs').argv
const strip = new Strip()

updateCanvasAnimations(strip, {"number":args.number,"speed": args.speed})
