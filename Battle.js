class Battle {
	// Should be able to handle the players and nodes completely internally.
	constructor(army1, player1, army2, player2, x, y, node) {
		this.army1 = army1;
		this.player1 = player1;
		this.army2 = army2;
		this.player2 = player2;
		this.x = x;
		this.y = y;
		this.node = node; //Node can be null
	}

	updatePlayers(loser) {
		if(this.player1.id == loser.player) {
			this.player1.removeArmy(loser.id);
		}
		if(this.player2.id == loser.player) {
			this.player2.removeArmy(loser.id);
		}
	}

	// Updates the winner with the spoils of the loser
	updateWinner(winner, loser) {
		if(this.node != null) {
			this.node.army = winner;
			if(this.node.buff != null) {
				winner.updateBuff(this.node.buff);
			}
			winner.x = this.node.x;
			winner.y = this.node.y;
		}
	}

	attack() {
		var army1Attack = this.army1.attackModifier * this.army1.count * 0.1;
		var army2Attack = this.army2.attackModifier * this.army2.count * 0.1;
		this.army1.count -= army2Attack;
		this.army2.count -= army1Attack;
	}

	// Returns true if the battle is ongoing, and false if it has finished
	tick() {
		this.attack();
		if(this.army1.count <= 0 || this.army2.count <= 0) {
			// If both armies get destroyed
			if(this.army1.count <= 0 && this.army2.count <= 0) {
				this.updatePlayers(this.army1);
				this.updatePlayers(this.army2);
			}
			if(this.army1.count <= 0) {
				this.updateWinner(this.army2, this.army1);
				this.updatePlayers(this.army1);
			}
			if(this.army2.count <= 0) {
				this.updateWinner(this.army1, this.army2);
				this.updatePlayers(this.army2);
			}
			return false;
		}
		return true;
	}
}

module.exports = {
   Battle:Battle
};
