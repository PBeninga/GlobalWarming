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
var mapNodes = makeMap();
var armies = getArmies(mapNodes);
var player_list = [];

function makeMap(){
	var nodes = [];
	var high = 5;
	var count = 0;
	for(var i = 1; i <= high; i++){
		for(var j = 1; j <= high; j++){
			let x =  i*100;
			let y =  j*100;
			nodes[count] = new gameObjects.MapNode(x,y)
			nodes[count].adj = [];
			if(i != 1){
				nodes[count].adj.push(i-1);
			}
			if(j != 1){
				nodes[count].adj.push(j-1);
			}
			if(i < high){
				nodes[count].adj.push(i+1);
			}
			if(j < high){
				nodes[count].adj.push(j+1);
			}
			count++;
		}
	}
	return nodes;

}
function getArmies(){}
function onInputFired(){}
// when a new player connects, we make a new instance of the player object,
// and send a new player message to the client.
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
function onNewClient(){
   this.broadcast.emit('newPlayer',{id:this.id});
   this.emit('connected',{id:this.id, players:player_list});
   player_list.push(this.id);
   this.emit('send_nodes', {nodes:mapNodes});

}
// io connection
var io = require('socket.io')(serv,{});

io.sockets.on('connection', function(socket){
	console.log("socket connected");
   	socket.on("client_started", onNewClient);
	// listen for disconnection;
	socket.on('disconnect', onClientdisconnect);
	//listen for new player inputs.
	socket.on("input_fired", onInputFired);
});
