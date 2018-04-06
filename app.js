var express = require('express');

var app = express();
var serv = require('http').Server(app);
//get the functions required to move players in the server.
var gameObjects = require('./objects.js');
var lg = require('./server/login.js');

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
var inputs = [];
let tickLength = 50;
tickGames();

function makeNewGame(){
	 let id = "/"+generateID(20)
	 let gameRoom = io.of(id);
	 var game  = new gameObjects.Game(gameRoom, id);
	 makeMap(game); //should move into objects.js
	 games.set(id,game);
	 return game;
}

function makeMap(game){
	var nodes = [];
	var high = 5;
	var count = 0;
	var castles = [0,4,24,20,10,14,12,2,22,18,6];
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
			if(castles.indexOf(count) == -1){
				nodes[count] = new gameObjects.MapNode(x,y,adj, count);
			}else{
				nodes[count] = new gameObjects.Castle(x,y,adj, count);
			}
			count++;
		}
	}
	game.map.startingCastles = [0,24,4,20];
	game.map.nodes = nodes;
	game.map.castles = castles;
}




function tickGames(){
	startTime = new Date().getTime();
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

	var buffer = inputs.slice();
		/*
			Data:
			id:
		*/
  inputs = [];
  for(data of buffer){
    if(games.has(data[0].game)){
      games.get(data[0].game).onInputFired(data[0],data[1]);
    }
  }
  var tickTime =  new Date().getTime() - startTime;
	if(tickTime < 0){
		tickTime = 0;
	}
  if(tickTime > tickLength){
    console.log("Dropping Frame");
    setTimeout(tickGames,(Math.floor(tickTime/tickLength)+1)*tickLength-tickTime);
  }else{
    setTimeout(tickGames, tickLength-tickTime);
  }
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
		// If the game has no players in it, we remove it.
		if(playersToGames.get(this.id).players.length == 0) {
			playersToGames.delete(this.id);
			console.log("removing game associated with " + this.id);
			console.log("current number of games is " + playersToGames.size);
		}
		else {
			console.log("game still contains");
			for(var i = 0; i < playersToGames.get(this.id).players.length; i++) {
				console.log("	" + playersToGames.get(this.id).players.id);
			}
		}
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
	inputs.push([data,this.id]);
}
function onLogin(data){
   var login = new lg.Login(this, this.id);
   login.onLogin(data.data);
}
function onNewAccount(data){
   var login = new lg.Login(this, this.id);
   login.onNewAccount(data.data);
}
io.sockets.on('connection', function(socket){
console.log("socket connected");
socket.on("client_started", onNewClient);
// listen for disconnection;
socket.on('input_fired', onInputFired);
socket.on('disconnect', onClientdisconnect);
socket.on('login', onLogin);
socket.on('new_account', onNewAccount);
//listen for new player inputs.
});

module.exports = {generateID : generateID}