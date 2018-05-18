var tickObject = require('./Tick.js');

class End extends tickObject.Tick{
	constructor() {
	}
	tick() {
		if(this.playerPool.activePlayers.length >2){

         this.gameState = STATE_COUNT_DOWN;
         console.log("Game starting.");
         let game = this;
         this.gameStartTime = new Date().getTime();
         setTimeout(function(){
            game.lastTroopIncTime = new Date().getTime();
            game.gameState = STATE_RUNNING;
            game.gameSocket.emit('startGame');
         }, TIME_TILL_START, game);
      }
	}
}
