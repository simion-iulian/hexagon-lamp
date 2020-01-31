
const express = require('express');
const Strip = require('./strip-controller');
const bodyParser = require('body-parser');
const AnimationPlayer = require('./animation-player');

const strip = new Strip();
const player = new AnimationPlayer(strip);

function runServer() {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.post('/play', (req, res) => {
        console.log(req.body);
        pattern = req.body.pattern
        player.play(pattern);
        res.status(200).end();
    })

    app.post('/stop', (req, res) => {
        console.log(req.body);
        pattern = req.body.pattern
        player.stop(pattern);
        res.status(200).end();
    })

    app.listen(3333);
    console.log(`Server listening on port 3333`);
}

runServer();
