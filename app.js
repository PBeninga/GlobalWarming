//////////////
// Link other files

var gameObject = require('./Game.js');
var mapObjects = require('./Map.js');
var lg = require('./server/login.js');


//////////////
// Express stuff

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client',express.static(__dirname + '/client'));
port = process.env.PORT || 2000
serv.listen(process.env.PORT || 2000);
console.log("Server started on port " + port);


//////////////
// io connection

var io = require('socket.io')(serv,{});


/////////////////
// Global varibales

var playersToGames = new Map();
var gamesToRemove = [];// all games;
var games = new Map();
let tickLength = 50;


/////////////////
// Start ticking

tick();


///////////////////////////////////////////////////////////////////////////////
// Tick functions

function tick(){

   startTime = new Date().getTime();

   tickGames(); //Iterates through all games and calls their tick methods

   removeFinishedGames();

   forceTickRate(startTime); // Wait until the minimum tick-time has passed

}


/////////////
// tick helpers

function tickGames(){

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

}

function removeFinishedGames(){

   for(var i = 0; i < gamesToRemove.length; i++){
      games.get(gamesToRemove[i]).endGame();
      games.delete(gamesToRemove[i]);
   }
   gamesToRemove = [];

}

function forceTickRate(startTime){

   var tickTime =  new Date().getTime() - startTime;

   if(tickTime < 0){
      tickTime = 0;
   }

   if(tickTime > tickLength){
      console.log("Dropping Frame");
      setTimeout(tick,(Math.floor(tickTime/tickLength)+1)*tickLength-tickTime);
   }else{
      setTimeout(tick, tickLength-tickTime);
   }

}


///////////////////////////////////////////////////////////////////////////////
// Opening Sockets

io.sockets.on('connection', function(socket){
console.log("socket connected");
socket.on("client_started", onNewClient);
// listen for disconnection;
socket.on('disconnect', onClientdisconnect);
socket.on('login', onLogin);
socket.on('new_account', onNewAccount);
socket.on('input_fired', onInputFired);
});


/////////////
// Socket callbacks

function onNewClient(){
    game = findGame(this.id);
    this.join(game.roomid)
    io.of(game.roomid).emit('newPlayer',{id:this.id, starting:game.starting});
    this.emit('connected',{id:this.id, players:game.players, game:game.roomid, timeTillStart:game.timeTillStart, starting:game.starting});//send the players id, the players, and the room id
    playersToGames.set(this.id, game);
    this.emit('send_nodes', {nodes:game.map.nodes, castles:game.map.castles});
    io.of(game.roomid).emit('update_nodes', {nodes:game.map.nodes});
}

//call when a client disconnects and tell the clients except sender to remove the disconnected player
//TODO have client send which game player is in, so we can remove them from it.
function onClientdisconnect(data) {
   
   console.log('disconnect');

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

function onLogin(data){
   var login = new lg.Login(this, this.id);
   login.onLogin(data.data);
}

function onNewAccount(data){
   var login = new lg.Login(this, this.id);
   login.onNewAccount(data.data);
}

function onInputFired(data) {
	currentGame = games.get(data.game);
	currentGame.addInput(data.nodes, this.id);
}


///////////////////////////////////////////////////////////////////////////////
// New Game

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
	game  = new gameObject.Game(io);
	games.set(game.roomid,game);
	game.addPlayer(id);
	return game;
}
