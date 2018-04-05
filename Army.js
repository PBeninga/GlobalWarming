var miscFunc = require('./MiscFunctions.js');

class Army{
   constructor(player,size){
      this.id = miscFunc.generateID(20);
      if(player){
        this.player = player.id;
        player.armies.push(this);
      }
      this.count = size;
      //this.buff = "swole";
   }
}

module.exports = {
    Army:Army
};
