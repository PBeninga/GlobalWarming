const { setWorldConstructor } = require('cucumber');
var gameMap = require('../../Map.js');
var miscFunc = require('../../MiscFunctions.js');
var armyObject = require('../../Army.js');
var playerObject = require('../../Player.js');
var gameObject = require('../../Game.js');

class io {
  constructor() {

  }
  of(id) {

  }
}

class CustomWorld {
  constructor() {
    this.game = new gameObject.Game(new io());
    this.myPlayer = new playerObject.Player(0);
    this.enemy = new playerObject.Player(1);
  }

  addMyArmy(count) {
    this.myPlayer.addArmy(count, this.game.map.nodes[0]);
  }

  addEnemyArmy(count) {
    this.enemy.addArmy(count, this.game.map.nodes[1]);
  }

  battle() {
    var losingArmy = this.myPlayer.armies[0].battle(this.enemy.armies[0]);
    if(losingArmy.player == 0) {
      this.myPlayer.removeArmy(losingArmy.id);
    }
    else {
      this.enemy.removeArmy(losingArmy.id);
    }
  }

  moveArmy() {
    this.game.moveArmy(this.myPlayer.armies[0], this.game.map.nodes[0], this.game.map.nodes[1], 100);
  }
}

setWorldConstructor(CustomWorld);
