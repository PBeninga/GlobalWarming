class Battle {
	// Should be able to handle the players and nodes completely internally.
	constructor(army1, player1, swipeList1, army2, player2, swipeList2, x, y, node) {
		this.army1 = army1;
		this.army1Attack = this.army1.attackModifier * this.army1.count * 0.05;
		this.player1 = player1;
		this.swipeList1 = swipeList1;
		this.army2 = army2;
		this.army2Attack = this.army2.attackModifier * this.army2.count * 0.05;
		this.player2 = player2;
		this.swipeList2 = swipeList2;
		this.x = x;
		this.y = y;
		this.node = node; //Node can be null
		this.moveArmy = 0;
	}

	updateLoser(loser) {
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
		this.army1.count -= army2Attack + (Math.random() * (army2Attack * 0.1));
		this.army2.count -= army1Attack + (Math.random() * (army2Attack * 0.1));
	}

	// Returns true if the battle is ongoing, and false if it has finished
	tick() {
		this.attack();
		if(this.army1.count <= 0 || this.army2.count <= 0) {
			var losers = new Array();
			// If both armies get destroyed
			if(this.army1.count <= 0 && this.army2.count <= 0) {
				losers.push(this.army1);
				losers.push(this.army2);
				this.end(null, losers);
			}
			if(this.army1.count <= 0) {
				losers.push(this.army1);
				this.end(this.army2, losers);
			}
			if(this.army2.count <= 0) {
				losers.push(this.army2);
				this.end(this.army1, losers);
			}
			return false;
		}
		return true;
	}

	end(winner, losers) {
		if(winner != null) {
			this.updateWinner(winner, losers[0]);
			if(this.player1.id == winner.player && this.swipeList1 != null) {
				this.moveArmy = 1;
			}
			if(this.player2.id == winner.player && this.swipeList2 != null) {
				this.moveArmy = 2;
			}
		}
		for(var i = 0; i < losers.length; i++) {
			this.updateLoser(losers[i]);
		}
	}
}

module.exports = {
   Battle:Battle
};
