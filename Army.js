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
     if(army == null){
       army = new Army(null,0,this.node, this.buff);
     }
     //if end node contains your army, just combine armies
     if(this.player == army.player){
       count += army.count;
       return army;
     }else{ //battle
       //if enemy army is greater, decrease enemy army by your attacking army count
       if(this.count >= army.count){
         army.count -= this.count;
         return this;
       }else{//conquer the node with your remaning troops (the difference)
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
