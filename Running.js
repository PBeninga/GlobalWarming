var tickObject = require('./Tick.js');

class End extends tickObject.Tick{
	constructor() {
	}
	tick() {
		this.incrementTroops(tickStartTime);
		this.moveArmies();
		this.checkCollisions();
		this.checkGameOver();
		this.garbageCollection();
	}

	// Increments all armies that have the 'castle' buff
	incrementTroops(tickStartTime){
		//Adds troops based on time not tick
		var troopsToAdd = 0;
		if(tickStartTime - this.lastTroopIncTime >= 500){
			troopsToAdd = Math.floor((tickStartTime -this.lastTroopIncTime)/100); //return to 500
			this.lastTroopIncTime = tickStartTime - (tickStartTime%500);
		}

		if(troopsToAdd > 0){

			for(var i = 0; i < this.playerPool.activePlayers.length; i++) {
				this.playerPool.activePlayers[i].incrementArmies(troopsToAdd);
			}
		}
	}

	moveArmies(){
		// Move all the armies (Done backwards because of splicing within for loop)
		for(var i = this.movingArmies.length - 1; i >= 0; i--){
			var currentArmy = this.movingArmies[i];
			// Ticks the MovingArmy and checks for completion
			if(!currentArmy.tick()) {
				var currentNode = this.map.nodes[currentArmy.nodeList[currentArmy.startIndex+1]]; // The ending node of the MovingArmy
				// if the node is occupied, initialize a battle and remove the MovingArmy from the list
				if(currentNode.army != null) {
					// If the current Node's army is the players, don't start a battle.
					if(currentArmy.army.player == currentNode.army.player) {
						currentNode.army.count += currentArmy.army.count;
						this.playerPool.getPlayer(currentArmy.army.player).removeArmy(currentArmy.army.id);
						console.log("Removed Army");
						this.movingArmies.splice(i,1);
					}
					else {
						this.battles.push(new battleObject.Battle(
							currentArmy.army, this.playerPool.getPlayer(currentArmy.army.player), null,
							currentNode.army, this.playerPool.getPlayer(currentNode.army.player), null,
							currentArmy.army.x, currentArmy.army.y,
							currentNode
						));
						console.log("Removed Army");
						this.movingArmies.splice(i,1);
					}
				}
				// Otherwise, check to see if the MovingArmy has reached its destination
				else if(!currentArmy.moveUpList()) {
					// If it has, remove it from the list and add it to the final nodes army variable
					var finished  = this.movingArmies.splice(i,1)[0];
					this.map.nodes[finished.nodeList[finished.nodeList.length-1]].army = finished.army;
				}
			}
		}
	}

	checkCollisions() {
		for(var i = 0; i < this.movingArmies.length; i++) {
			var currentArmy = this.movingArmies[i];
			for(var j = 0; j < this.movingArmies.length; j++) {
				//Not counting the army we're checking
				if(j == i) {
					continue;
				}
				if(currentArmy.army.checkCollision(this.movingArmies[j].army.x, this.movingArmies[j].army.y)) {
					this.battles.push(new battleObject.Battle(
						currentArmy.army, this.playerPool.getPlayer(currentArmy.army.player), currentArmy.swipeList.slice(currentArmy.startIndex),
						this.movingArmies[j].army, this.playerPool.getPlayer(this.movingArmies[j].army.player), this.movingArmies[j].swipeList.slice(this.movingArmies[j].startIndex),
						currentArmy.army.x, currentArmy.army.y,
						null
					));
					this.movingArmies.splice(i,1);
					this.movingArmies.splice(j,1);
					// Used to make sure that the for loop doesn't go out of whack
					if(j < i) {
						i--;
					}
					break;
				}
			}
		}
	}


	checkGameOver(){
		// Check for end condition (1 Player + DummyPlayer remaining)
		//TODO: Change to check for 2 Players and no Dummy Player
		if(this.playerPool.activePlayers.length <= 2 && this.gameState == STATE_RUNNING){
			this.winner = this.playerPool.activePlayers[1].id;
			this.gameState = STATE_GAME_OVER;
			this.removeGame(this.roomid);
			var winner = null;
			for(var i = 0; i < this.playerPool.activePlayers.length; i++) {
				if(this.playerPool.activePlayers[i].id != null) {
					winner = this.playerPool.activePlayers[i].id;
				}
			}
			console.log("Game has ended");
			this.gameSocket.emit("endGame",{winner:winner});
		}
	}

	garbageCollection(){
		// Removes
		// Players, Battles ...
		// From their respective arrays

		for(var i = this.battles.length - 1; i >= 0; i--) {
			if(!this.battles[i].tick()) {
				var removedBattle = this.battles.splice(i, 1)[0];
				if(removedBattle.moveArmy == 1) {
					this.addInput(removedBattle.swipeList1, removedBattle.player1.id)
				}
				if(removedBattle.moveArmy == 2) {
					this.addInput(removedBattle.swipeList2, removedBattle.player2.id)
				}
				console.log("Removed a battle");
			}
		}
		for(var i = 0; i < this.playerPool.activePlayers.length; i++) {
			if(this.playerPool.activePlayers[i].armies.length == 0) {
				this.playerPool.removePlayer(this.playerPool.activePlayers[i].id);
			}
		}

	}
}
