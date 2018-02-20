var socket;
socket = io.connect();

//the enemy player list
var enemies = [];

var gameProperties = {
	gameWidth: 4000,
	gameHeight: 4000,
	game_elemnt: "gameDiv",
	in_game: false,
};

var main = function(game){
};

function onsocketConnected (data) {
	console.log("connected to server");
   console.log(this.id+" "+data.id)
   enemies = data.players.slice();
	gameProperties.in_game = true;
	// send the server our initial position and tell it we are connected
}

// When the server notifies us of client disconnection, we find the disconnected
// enemy and remove from our game
function onRemovePlayer (data) {
	var removePlayer = findplayerbyid(data.id);
	// Player not found
	if (!removePlayer) {
		console.log('Player not found: ', data.id)
		return;
	}
	enemies.splice(enemies.indexOf(removePlayer), 1);
}

//Server will tell us when a new enemy player connects to the server.
//We create a new enemy in our game.
function onNewPlayer (data) {
	//enemy object
   console.log("added: "+data.id);
	enemies.push(data.id);
}

//This is where we use the socket id.
//Search through enemies list to find the right enemy of the id.
function findplayerbyid (id) {
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i] == id) {
			return enemies[i];
		}
	}
}
main.prototype = {

	create: function () {
		game.stage.backgroundColor = 0xE1A193;;
		console.log("client started");
      socket.emit("client_started",{});
      socket.on('connected', onsocketConnected);
		socket.on('remove_player', onRemovePlayer);
      socket.on('newPlayer', onNewPlayer)
		//when the player receives the new input
	},

	update: function () {
		// emit the player input
	}
};
