var armyObject = require('./Army.js');

class PlayerPool{
  constructor() {
    this.activePlayers = [];
    this.inactivePlayers = [];
  }

  contains(id) {
    for(var i = 0; i < this.activePlayers.length; i++) {
      if(this.activePlayers[i].id == id) {
        return 1;
      }
    }
    for(var i = 0; i < this.inactivePlayers.length; i++) {
      if(this.inactivePlayers[i].id == id) {
        return 2;
      }
    }
    return 0;
  }

  addPlayer(id) {
    for(var i = 0; i < this.activePlayers.length; i++) {
      if(this.activePlayers[i].id == id) {
        return null;
      }
    }
    for(var i = 0; i < this.inactivePlayers.length; i++) {
      if(this.inactivePlayers[i].id == id) {
        var addedPlayer = this.inactivePlayers.splice(i, 1);
        this.activePlayers.push(addedPlayer);
        return addedPlayer;
      }
    }
    var newPlayer = new Player(id);
    this.activePlayers.push(newPlayer);
    return newPlayer;
  }

  getPlayer(id) {
    for(var i = 0; i < this.activePlayers.length; i++) {
      if(this.activePlayers[i].id == id) {
        return this.activePlayers[i];
      }
    }
    return null;
  }

  removePlayer(id) {
    var removedPlayer = null;
    for(var i = 0; i < this.activePlayers.length; i++) {
      if(this.activePlayers[i].id == id) {
        this.inactivePlayers.push(this.activePlayers.splice(i, 1));
        return true;
      }
    }
    return false;
  }
}

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
        if(this.armies[i].id == id){
          var removedArmy = this.armies.splice(i, 1);
          return removedArmy;
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
      var moveArmy = this.findArmyById(id);
      // If the army is on a castle, create an army to send
      if(moveArmy.buff != null){
        var toMove = Math.floor(moveArmy.count/2);
        moveArmy.count -= toMove;
        moveArmy = this.addArmy(toMove, node);
        if(moveArmy.buff == 'castle') {
          moveArmy.buff = null;
        }
      }
      return moveArmy;
    }
}

module.exports = {
  PlayerPool:PlayerPool,
    Player:Player
};
