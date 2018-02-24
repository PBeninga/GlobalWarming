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
var player_list = []; // all players connected across all games.
var games = [];// all games;
makeNewGame();
function makeNewGame(){
	 var game  = new gameObjects.Game()
	 makeMap(game); //should move into objects.js
	 games.push(game);
}

function makeMap(game){
	var nodes = [];
	var high = 5;
	var count = 0;
	var castles = [];
	for(var i = 1; i <= high; i++){
		for(var j = 1; j <= high; j++){
			let x =  i*100;
			let y =  j*100;
			var adj = [];
			if(i != 1){
				adj.push(count-1);
			}
			if(j != 1){
				adj.push(count-5);
			}
			if(i < high){
				adj.push(count+1);
			}
			if(j < high){
				adj.push(count+5);
			}
			if(x != 100){
				nodes[count] = new gameObjects.MapNode(x,y,adj);
			}else{
				castles.push(count);
				nodes[count] = new gameObjects.Castle(x,y,adj);
			}
			count++;
		}
	}
	game.map.nodes = nodes;
	game.map.castles = castles;
}
function onInputFired(){}

//call when a client disconnects and tell the clients except sender to remove the disconnected player
//TODO have client send which game player is in, so we can remove them from it.
function onClientdisconnect() {
	console.log('disconnect');

	var removePlayer = find_playerid(this.id);

	if (removePlayer) {
		player_list.splice(player_list.indexOf(removePlayer), 1);
	}
	removePlayer = find_playerid_in_game(this.id, games[0]);
	if (removePlayer) {
		games[0].removePlayer(removePlayer);
	}

	console.log("removing player " + this.id);

	//send message to every connected client except the sender
	this.broadcast.emit('remove_player', {id: this.id});

}

// find player by the the unique socket id
function find_playerid_in_game(id, game){


	for (var i = 0; i < game.players.length; i++) {

		if (game.players[i] == id) {
			return game.players[i];
		}
	}

	return false;
}
function find_playerid(id) {

	for (var i = 0; i < player_list.length; i++) {

		if (player_list[i] == id) {
			return player_list[i];
		}
	}

	return false;
}
function getStartingCastleToAssign(game, id){//should be in objects.js
	for(var i = 0; i < game.map.castles.length; i++){
		console.log(game.map.nodes[game.map.castles[i]].army.player);
		if(game.map.nodes[game.map.castles[i]].army.player == null){
			game.map.nodes[game.map.castles[i]].assignPlayer(id);
			console.log("assigning: "+ game.map.castles[i] + "To " + id);
			game.map.castlesChanged = [];
			game.map.castlesChanged.push(game.map.castles[i]);
			return;
		}
	}
}

function onNewClient(){
   this.broadcast.emit('newPlayer',{id:this.id});
   this.emit('connected',{id:this.id, players:games[0].players});
   player_list.push(this.id);
   games[0].players.push(this.id);
   getStartingCastleToAssign(games[0], this.id);
   this.emit('send_nodes', {nodes:games[0].map.nodes, castles:games[0].map.castles});
   //This is janky as fuck, just have it to prove a concept, needs to be cleanly reworked.
   this.broadcast.emit('update_nodes',{nodes:games[0].map.castlesChanged, change: games[0].map.nodes[games[0].map.castlesChanged[0]]});

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
