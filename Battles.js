class Battle {
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
			if(this.army1.count <= 0 && this.army2.count <= 0) {
				updatePlayers(this.army1);
				updatePlayers(this.army2);
			}
			if(this.army1.count <= 0) {
				updateWinner(this.army2, this.army1);
				updatePlayers(this.army1);
			}
			if(this.army2.count <= 0) {
				updateWinner(this.army1, this.army2);
				updatePlayers(this.army2);
			}
		}
	}
}
