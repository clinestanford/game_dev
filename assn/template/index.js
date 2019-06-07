
'use strict';

let express = require('express');
let app = express();
let http = require('http').Server(app);
//let io = require('socket.io')(http);
let port = 3000;
let game = require('./scripts/server/game');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
	res.sendFile('index.html', {root: __dirname})
});

http.listen(port, '0.0.0.0', function() {
	console.log('listening on port ' + port);
	game.initialize(http);
})