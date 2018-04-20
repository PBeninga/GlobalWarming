const { setWorldConstructor } = require('cucumber');
var gameMap = require('../../Map.js');
var miscFunc = require('../../MiscFunctions.js');
var armyObject = require('../../Army.js');
var playerObject = require('../../Player.js');

class CustomWorld {
  constructor() {
    this.myPlayer = new playerObject.Player(0);
    this.enemy = new playerObject.Player(1);
    this.dummyNode = new gameMap.MapNode(0, 0, [], 0);
  }

  addMyArmy(count) {
    this.myPlayer.addArmy(count, dummyNode);
  }

  incrementBy(number) {
    this.variable += number;
  }
}

setWorldConstructor(CustomWorld);
