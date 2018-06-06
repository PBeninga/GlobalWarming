class Battle {
	// Should be able to handle the players and nodes completely internally.
	constructor(x, y, node) {
		this.armies = [];
		this.armyAttacks = [];
		this.players = [];
		this.swipeLists = [];
		this.x = x;
		this.y = y;
		this.node = node; //Node can be null
		this.moveArmy = false;
	}

	addArmy(army, Player, swipeList) {
		for(var i = 0; i < this.players.length; i++) {
			if(Player.id == this.players[i].id) {
				this.armies[i].count += army.count;
				if(this.armies[i].buff == null) {
					this.armies[i].updateBuff(army.buff);
				}
				this.armyAttacks[i] = this.armies[i].attackModifier * Math.log(this.armies[i].count) * 0.025;
				console.log("Removing unneccesary army");
				Player.removeArmy(army.id);
				return;
			}
		}
		this.armies.push(army);
		this.armyAttacks.push(army.attackModifier * army.count * 0.05);
		this.players.push(Player);
		this.swipeLists.push(swipeList);
	}

	updateLoser(i) {
		console.log("REMOVED");
		this.players[i].removeArmy(this.armies[i].id);
		this.players.splice(i, 1);
		this.swipeLists.splice(i, 1);
		this.armies.splice(i, 1);
		this.armyAttacks.splice(i, 1);
	}

	// Updates the winner with the spoils of the loser
	updateWinner(winner) {
		if(this.node != null) {
			console.log("Placing winner " + winner.id + " onto node " + this.node.id);
			this.node.army = winner;
			if(this.node.buff != null) {
				winner.updateBuff(this.node.buff);
			}
			winner.x = this.node.x;
			winner.y = this.node.y;
		}
	}

	attack() {
		for(var i = 0; i < this.armies.length; i++) {
			for(var j = 0; j < this.armies.length; j++) {
				if(this.armies[i].player != this.armies[j].player) {
					this.armies[j].count -= this.armyAttacks[i] + (Math.random() * (this.armyAttacks[i] * 0.1));
				}
			}
		}
	}

	// Returns true if the battle is ongoing, and false if it has finished
	tick() {
		this.attack();
		for(var i = 0; i < this.armies.length; i++) {
			if(this.armies[i].count <= 0) {
				this.updateLoser(i);
			}
		}
		if(this.players.length <= 1) {
			if(this.armies.length == 1) {
				this.updateWinner(this.armies[0]);
				if(this.swipeLists[0] != null) {
					this.moveArmy = true;
				}
			}
			return false;
		}
		return true;
	}
}

module.exports = {
   Battle:Battle
};
