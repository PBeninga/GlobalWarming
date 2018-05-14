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
var games = new Map();


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
    this.emit('connected',{id:this.id, players:game.playerPool.activePlayers, game:game.roomid, timeTillStart:game.timeTillStart, starting:game.starting});//send the players id, the players, and the room id
    playersToGames.set(this.id, game);
    this.emit('send_nodes', {nodes:game.map.nodes, players:game.playerPool.activePlayers});
}

//call when a client disconnects and tell the clients except sender to remove the disconnected player
//TODO have client send which game player is in, so we can remove them from it.
function onClientdisconnect(data) {

   console.log('disconnect');

   if(playersToGames.has(this.id)){
       playersToGames.get(this.id).removePlayer(this.id);
       // If the game has no players in it, we remove it.
       if(playersToGames.get(this.id).playerPool.activePlayers.length == 0) {
           playersToGames.delete(this.id);
           console.log("removing game associated with " + this.id);
           console.log("current number of games is " + playersToGames.size);
       }
       else {
           console.log("game still contains");
           for(var i = 0; i < playersToGames.get(this.id).playerPool.activePlayers.length; i++) {
               console.log("	" + playersToGames.get(this.id).playerPool.activePlayers[i].id);
           }
       }
   }
   console.log("removing player " + this.id);
   //send message to every connected client except the sender
}

function onLogin(data){
   var login = new lg.Login(this, this.id);
   login.onLogin(data.data, callback); // ADAM & MAX I'M PASSING YOUR TODO CALLBACK FUNCTION TO ONLOGIN HERE
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
	game  = new gameObject.Game(removeGame, io);
	games.set(game.roomid,game);  // Add the game to the map with key roomid
	game.addPlayer(id);
	return game;
}

function removeGame(gameId){
    console.log("removing game "+ gameId);
    games.delete(gameId);
}

