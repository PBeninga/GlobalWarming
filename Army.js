var miscFunc = require('./MiscFunctions.js');

class Army{
   constructor(player,count,node,x,y,buff){
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

   // returns the loser
   battle(army) {
     console.log("Commencing battle!");
     //if end node contains your army, just combine armies
     if(this.player == army.player){
       console.log("   Armies owned by same person!")
       this.count += army.count;
       return army;
     }else{ //battle
       //if enemy army is greater, decrease enemy army by your attacking army count
       if(army.count >= this.count){
         console.log(army.player + " won the battle!");
         army.count -= this.count;
         return this;
       }else{//conquer the node with your remaning troops (the difference)
         console.log(this.player + " won the battle!");
         this.count -= army.count;
         this.buff = army.buff;
         this.node = army.node;
         return army;
       }
     }
   }
}

module.exports = {
    Army:Army
};
