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
// io connection
var io = require('socket.io')(serv,{});
var playersToGames = new Map();
var player_list = []; // all players connected across all games.
var gamesToRemove = [];// all games;
var games = new Map();
let tickLength = 250;
tickGames();

function makeNewGame(){
	 let id = "/"+generateID(20)
	 let gameRoom = io.of(id);
	 var game  = new gameObjects.Game(gameRoom, id);
	 makeMap(game); //should move into objects.js
	 games.set(id,game);
	 return game;
}
function tickGames(){
	thisTick = new Date().getTime();
	gamesIter = games.values();
	element = gamesIter.next();
	while(!element.done){
		game = element.value
		game.tick();
		if(game.finished){
			gamesToRemove.push(game.roomid);
		}
		element = gamesIter.next();
	}
	for(var i = 0; i < gamesToRemove.length; i++){
		games.get(gamesToRemove[i]).endGame();
		games.delete(gamesToRemove[i]);
	}
	gamesToRemove = [];
	tickTime =  tickLength - (new Date().getTime() - thisTick);
	if(tickTime < 0){
		tickTime = 0;
	}
	setTimeout(tickGames, tickTime);
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
			// If the node isn't on the left layer, push the node on the left.
			if(i != 1){
				adj.push(count-5);
			}
			// If the node isn't on the top layer, push the node on top.
			if(j != 1){
				adj.push(count-1);
			}
			// If the node isn't on the right layer, push the node on the right.
			if(i < high){
				adj.push(count+5);
			}
			// If the node isn't on the bottom layer, push the node on bottom.
			if(j < high){
				adj.push(count+1);
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

//call when a client disconnects and tell the clients except sender to remove the disconnected player
//TODO have client send which game player is in, so we can remove them from it.
function onClientdisconnect(data) {
	console.log('disconnect');

	var removePlayer = find_playerid(this.id);
	if (removePlayer) {
		player_list.splice(player_list.indexOf(removePlayer), 1);
	}
	if(playersToGames.has(this.id)){
		playersToGames.get(this.id).removePlayer(this.id);
	}
	console.log("removing player " + this.id);
	//send message to every connected client except the sender
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
function findGame(id){
	gamesIter = games.values();
	element = gamesIter.next();
	while(!element.done){
		game = element.value
		if(!game.started && game.addPlayer(id)){
			console.log("returning a game");
			return game;
		}
		element = gamesIter.next();
	}
	//if there are no open games add the player.
	game = makeNewGame();
	game.addPlayer(id);
	return game;
}
function onNewClient(){
	game = findGame(this.id)
	this.join(game.roomid)
   	io.of(game.roomid).emit('newPlayer',{id:this.id, starting:game.starting});
   	this.emit('connected',{id:this.id, players:game.players, game:game.roomid, timeTillStart:game.timeTillStart, starting:game.starting});//send the players id, the players, and the room id
	player_list.push(this.id);
	playersToGames.set(this.id, game);   
   	this.emit('send_nodes', {nodes:game.map.nodes, castles:game.map.castles});
	io.of(game.roomid).emit('update_nodes', {nodes:game.map.nodes});
	   

}
function generateID(length) {
    let text = ""
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for(let i = 0; i < length; i++)  {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
}
function onInputFired(data){
	if(games.has(data.game)){
		games.get(data.game).onInputFired(data, this.id);
	}
}
io.sockets.on('connection', function(socket){
	console.log("socket connected");
  	socket.on("client_started", onNewClient);
	// listen for disconnection;
	socket.on('input_fired', onInputFired);
	socket.on('disconnect', onClientdisconnect);
	//listen for new player inputs.
});
