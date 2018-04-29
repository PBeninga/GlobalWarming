var miscFunc = require('./MiscFunctions.js');

// *********************************************
// IMPORTANT - ARMY ONLY HOLDS IDS. DOES NOT HOLD OBJECTS
// *********************************************
class Army{
   constructor(player,count,node,x,y,buff) {
      this.id = miscFunc.generateID(20);
      this.player = null;
      if(player != null) {
        this.player = player.id;
      }
      this.node = node;
      this.x = x;
      this.y = y;
      this.count = count;
      this.buff = buff;
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
   buff(buff) {
      this.buff = buff;
   }
}

module.exports = {
    Army:Army
};
