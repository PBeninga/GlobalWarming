var express = require('express');

var app = express();
var serv = require('http').Server(app);
//get the functions required to move players in the server.
var gameObjects = require('./objects.js');

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(process.env.PORT || 2000);
console.log("Server started.");
var player_ids = new Map();
var player_list = [];


function onInputFired(){}
// when a new player connects, we make a new instance of the player object,
// and send a new player message to the client.
function uuid() {
   var S4 = function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
   };
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
//call when a client disconnects and tell the clients except sender to remove the disconnected player
function onClientdisconnect() {
	console.log('disconnect');

	var removePlayer = find_playerid(this.id);

	if (removePlayer) {
		player_list.splice(player_list.indexOf(removePlayer), 1);
	}

	console.log("removing player " + this.id);

	//send message to every connected client except the sender
	this.broadcast.emit('remove_player', {id: this.id});

}

// find player by the the unique socket id
function find_playerid(id) {

	for (var i = 0; i < player_list.length; i++) {

		if (player_list[i] == id) {
			return player_list[i];
		}
	}

	return false;
}

function newPlayer(){

}
 // io connection
var io = require('socket.io')(serv,{});

io.sockets.on('connection', function(socket){
	console.log("socket connected")
   let pubPlayerId = uuid();
   let privatePlayerId = uuid();

	player_list.push(pubPlayerId);
   player_ids.set(privatePlayerId, pubPlayerId);
   socket.on("new_player", newPlayer);
   socket.broadcast.emit('new_player', {id: pubPlayerId});

   socket.emit("id",{privateId: privatePlayerId, publicId: pubPlayerId});
	// listen for disconnection;
	socket.on('disconnect', onClientdisconnect);
	//listen for new player inputs.
	socket.on("input_fired", onInputFired);
});
