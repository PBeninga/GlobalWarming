var gameMap = require('./Map.js');
var miscFunc = require('./MiscFunctions.js');
var armyObject = require('./Army.js');
var playerObject = require('./Player.js');
var movingArmyObject = require('./MovingArmy.js');
var battleObject = require('./Battle.js');

let MAX_PLAYERS = 4;

class MatchMaking {
	constuctor(removeLobby, io) {
		let id = "/"+miscFunc.generateID(20)
      let lobbySocket = io.of(id);
      this.roomid = id;
      this.lobbySocket = lobbySocket;
      this.removeLobby = removeLobby;  // This is a callback to app.js

		this.players = [];
	}

	onPlayerDisconnect(){
      this.removePlayer(this.id);
   }

   removePlayer(id){
		for(var i = 0; i < this.players.length; i++) {
			if(players[i].id == player.id) {
				console.log('Player ' + id + ' successfully removed');
				players.splice(i, 1);
			}
		}
   }

	//return true on player succesfully added
	addPlayer(player){
		if(this.players.length >= MAX_PLAYERS){
			console.log("This lobby is full.");
		}
		for(var i = 0; i < this.players.length; i++) {
			if(players[i].id == player.id) {
				console.log("Attempting to add player that already exists.");
			}
		}
		this.players.push(player);
		if(this.players.length == MAX_PLAYERS) {
			this.start();
		}
	}
}
