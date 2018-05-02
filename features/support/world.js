const { setWorldConstructor } = require('cucumber');
var gameMap = require('../../Map.js');
var miscFunc = require('../../MiscFunctions.js');
var armyObject = require('../../Army.js');
var playerObject = require('../../Player.js');
var gameObject = require('../../Game.js');
var battleObject = require('../../Battle.js');
var movingObject = require('../../MovingArmy.js');

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
      this.movingArmy = null;
      this.battle = null;
   }

   addMyArmy(count) {
      this.myPlayer.addArmy(count, this.game.map.nodes[0]);
   }

   addEnemyArmy(count) {
      this.enemy.addArmy(count, this.game.map.nodes[1]);
   }

   battle() {
      var battle = new battleObject.Battle(
         this.myPlayer.armies[0], this.myPlayer,
         this.enemy.armies[0], this.enemy,
         this.myPlayer.armies[0].x, thos.myPlayer.armies[0].y,
         this.game.map.nodes[0]
      );
   }

   commenceBattle() {
      while(this.battle.tick()) {
         continue;
      }
   }

   moveArmy() {
      this.movingArmy = new movingObject.MovingArmy(
         this.myPlayer.armies[0],
         {{x:this.map.nodes[0].x,y:this.map.nodes[0].y}, {x:this.map.nodes[1].x,y:this.map.nodes[1].y}},
         {0, 1}
      );
   }

   commenceMovement() {
      while(this.movingArmy.tick()) {
         continue;
      }
   }
}

setWorldConstructor(CustomWorld);
