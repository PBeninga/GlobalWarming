var miscFunc = require('./MiscFunctions.js');
var locationClass = require('./Location.js');

var armySize = 30;
// *********************************************
// IMPORTANT - ARMY ONLY HOLDS IDS. DOES NOT HOLD OBJECTS
// *********************************************
class Army extends locationClass.Location{
   constructor(player,count,node,x,y,buff) {
      super(x, y);
      this.id = miscFunc.generateID(20);
      this.player = player.id;
      this.node = node;
      this.count = count;
      this.buff = buff;

      this.movementSpeed = 6.0;
      this.attackModifier = 1.0;
      this.defenseModifier = 1.0;
   }

   // returns the loser, so it can be removed from it's node and it's players list
   battle(army) {
     //if end node contains your army, just combine armies
     if(this.player == army.player){
       this.count += army.count;
       return army;
     }else{ //battle
       //if enemy army is greater, decrease enemy army by your attacking army count
       if(army.count >= this.count){
         army.count -= this.count;
         return this;
       //otherwise, conquer the node with your remaning troops.
       }else{
         this.count -= army.count;
         this.buff = army.buff;
         this.node = army.node;
         return army;
       }
     }
   }
   // TODO: In the future, we should use this function to update buff values
   updateBuff(buff) {
      this.buff = buff;
   }

   checkCollision(x, y) {
      if(this.distance(x, y) <= armySize) {
         return true;
      }
      return false;
   }
}

module.exports = {
    Army:Army
};
