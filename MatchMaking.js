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

		this.playerPool = new playerObject.PlayerPool(); // used for compatibility
	}

   removePlayer(id){
		this.playerPool.removePlayer(id);
   }

	//return true on player succesfully added
	addPlayer(player){
		if(this.playerPool.activePlayers.length >= MAX_PLAYERS){
			console.log("This lobby is full.");
		}
		this.playerPool.addPlayer(player);
		if(this.playerPool.activePlayers.length == MAX_PLAYERS) {
			this.start();
		}
	}

	start() {
		this.removeLobby(this.roomid, this.playerPool);
		this.gameSocket.emit("startGame",{});
	}
}
