var armyObject = require('./Army.js');

class Player{
    constructor(id){
        this.id = id;
        this.name = null;
        this.armies = [];
    }

    incrementArmies(toAdd) {
      if(this.id == null) {
        return;
      }
      for(var i = 0; i < this.armies.length; i++) {
        if(this.armies[i].node != null && this.armies[i].buff != null) {
          this.armies[i].count += toAdd;
        }
      }
    }

    removeArmy(id) {
      for(var i = 0; i < this.armies.length; i++){
          if(this.armies[i] == id){
              return this.armies.splice(i, 1);
          }
      }
      return null;
    }

    removeArmyAtNode(node) {
      for(var i = 0; i < this.armies.length; i++){
          if(this.armies[i].node == node.id){
              return this.armies.splice(i, 1);
          }
      }
      return null;
    }

    findArmyIndexById(id){
        for(var i = 0; i < this.armies.length; i++){
            if(this.armies[i].id == id){
                return i;
            }
        }
        return -1;
    }
    findArmyById(id){
        let index  = this.findArmyIndexById(id);
        if(index > -1){
            return this.armies[index];
        }else{
            return null;
        }
    }

    addArmy(count, node) {
      var newArmy = new armyObject.Army(this, count, node.id, node.x, node.y, node.buff);
      this.armies.push(newArmy);
      return newArmy;
    }

    moveArmy(id, node) {
      console.log("Moving Army ID: " + id);
      var moveArmy = this.findArmyById(id);
      // If the army is on a castle
      if(moveArmy.buff != null){
        var toMove = Math.floor(moveArmy.count/2);
        moveArmy -= toMove;
        moveArmy = this.addArmy(toMove, node)
        this.armies.push(moveArmy);
      }
      else {
      }
      return moveArmy;
    }
}

module.exports = {
    Player:Player
};
