var gameMap = require('./Map.js');
var miscFunc = require('./MiscFunctions.js');
var armyObject = require('./Army.js');
var playerObject = require('./Player.js');
const fs = require('fs');

class Game{
   constructor(io){ 
      
      let id = "/"+miscFunc.generateID(20)
	  let gameSocket = io.of(id);
      this.roomid = id;
      this.gameSocket = gameSocket;
      //Useful game data
      this.players = [];
      this.dummyPlayer = new playerObject.Player(null);
      this.players.push(this.dummyPlayer);
      this.map = new gameMap.Map();
      this.inputs = [];
      this.movingArmies = [];
      //To be replaced when we explicitly put in matchmaking
      this.started = false;
      this.starting = false;
      //Finishing Variables
      this.finished =  false;
      this.winner = null;
      //Game Variables
      this.maxPlayers = 4;
      this.constTimeTillStart = 3000;
      this.timeTillStart = 3000;
      this.timeGameBeganStarting = null;
      this.time = new Date().getTime();
   }

   addInput(moveNodes, id){
     this.inputs.push(moveNodes);
     this.inputs.push(id);
   }

   doInputs(){
     for(var i = 0; i < this.inputs.length; i++) {
       console.log("Doing Input");
       var moveNodes = this.inputs[i];
       i++;
       var id = this.inputs[i];
        if(this.map.nodes[moveNodes[0]].army && //the start node has an army
          this.map.nodes[moveNodes[0]].army.count > 0 && //the start node's army has enough troops
          this.map.nodes[moveNodes[0]].army.player == id && //the start node's army is equal to
          this.started){
            this.moveArmy(moveNodes, this.map.nodes[moveNodes[0]].army.id, this.findPlayerById(id));
        }
      }
      this.inputs = [];
   }
   incrementTroops(num){
      for(var i = 0; i < this.players.length; i++) {
        this.players[i].incrementArmies(num);
      }
   }
   moveArmy(nodes, armyID, player){
     //TODO: Fix hacky solution
     var currentPlayerArmyListLength = player.armies.length;
     var movingArmy = player.moveArmy(armyID, nodes[0]);
     if(currentPlayerArmyListLength == player.armies.length) {
       nodes[0].army = null;
     }
     this.movingArmies.push({nodes:nodes, army:movingArmy, percentage:0});
   }
   onPlayerDisconnect(){
      this.removePlayer(this.id);
   }
   removePlayer(id){
      if(this.findPlayerIndexById(id) == -1){
         console.log("Attempting to remove player that doesn't exist.");
         return;
      }
      console.log("removing player: "+id+" from game"+this.roomid);
      //find any army in a mapnode that is owned by removed player
      var toRemove = [];
      for(var i = 0; i < this.map.nodes.length; i++){
         if(this.map.nodes[i].army != null && this.map.nodes[i].army.player == id){
            toRemove.push(i);
         }
      }
      //Alter the players nodes in some way.
      for(var i = 0; i < toRemove.length; i++){
         if(this.map.castles.indexOf(toRemove[i]) != -1){
            this.map.nodes[toRemove[i]].army = new armyObject.Army(null,50,this.map.nodes[toRemove[i]]);
         }else{
             this.map.nodes[toRemove[i]].army = null;
         }
      }

      this.players.splice(this.findPlayerIndexById(id),1);
   }
   //return true on player succesfully added
   addPlayer(id){
      if(this.players.includes(id)){
         console.log("Attempting to add player that already exists.");
         return false;
      }
      //finds first node that is a castle, not owned by another player, and assigns it to the new player.
      //***need to check if castle is being attacked
      var destination = -1;
      for(var i = 0; i < this.map.startingCastles.length; i++){
         if(this.map.nodes[this.map.startingCastles[i]].army.player == null){
            var destination = this.map.startingCastles[i];
            break;
         }
      }
      if(destination == -1 || this.players.length == this.maxPlayers){
          console.log("Could not find a castle.");
          return false;
      }
      console.log("Player assigned castle.");
      let player = new playerObject.Player(id);
      this.players.push(player);
      this.dummyPlayer.removeArmyAtNode(this.map.nodes[destination]);
      this.map.nodes[destination].army = player.addArmy(50,this.map.nodes[destination]);
      return true;
   }
   endGame(){
       this.gameSocket.emit("endGame",{winner:this.winner});
   }
   findPlayerIndexById(id){
       for(var i = 0; i <  this.players.length; i++){
           if(this.players[i].id == id){
               return i;
           }
       }
       return -1;
   }
   findPlayerById(id){
       var index = this.findPlayerIndexById(id);
       if(index > -1){
           return this.players[index];
       }else{
           return null;
       }
   }
   tick(){
        var troopsToAdd = 0;
        this.gameSocket.emit('update_armies', {players:this.players});

        var tickStartTime = new Date().getTime();
        if(tickStartTime - this.time >= 500){
           troopsToAdd = Math.floor((tickStartTime -this.time)/500);
           this.time = tickStartTime - (tickStartTime%500);
        }
        // If there are more than 1 player (DummyPlayer doesnt count) and the game isn't started or starting
        if(this.players.length > 2 && !this.starting && !this.started){
            this.starting = true;
            console.log("Game starting.");
            let game = this;
            this.timeGameBeganStarting = new Date().getTime();
            setTimeout(function(){
                game.started = true;
                game.gameSocket.emit('startGame');
            }, this.constTimeTillStart);
        }
        if(this.started){
            if(troopsToAdd > 0){
               this.incrementTroops(troopsToAdd);
            }

            this.gameSocket.emit('move_armies', {moving:this.movingArmies});
            // Move all the armies
            for(var i = 0; i < this.movingArmies.length; i++){
              var currentMoving = this.movingArmies[i];
              var startNode = this.map.nodes[this.movingArmies[i].nodes[0]];
              var endNode = this.map.nodes[this.movingArmies[i].nodes[1]];
              currentMoving.percentage += 5;
                if(currentMoving.percentage >= 100){
                    var battleLoser = currentMoving.army.battle(endNode.army);
                    //Remove the army from the players list
                    if(battleLoser.player != null) {
                      this.findPlayerById(battleLoser.player).removeArmy(battleLoser.id);
                    }
                    //Replace the end node's army with the moving army if it won.
                    if(battleLoser.id != currentMoving.army.id) {
                      endNode.army = currentMoving.army;
                    }
                    var finished  = this.movingArmies.splice(i,1)[0];
                    // Check for end consition
                    if(finished.nodes.length > 2){
                       finished.nodes.shift();
                       this.moveArmy(finished.nodes, finished.army, this.findPlayerById(finished.army.player));
                    }
                }
            }
            // Check for end condition (1 Player + DummyPlayer remaining)
            if(this.players.length <= 2 && this.started){
                if(this.players[0].id == this.dummyPlayer.id){
                  this.winner = this.players[1];
                }
                else {
                  this.winner = this.players[0];
                }
                this.finished = true;
            }
        }else if(this.starting){
            this.timeTillStart = this.constTimeTillStart - (new Date().getTime() - this.timeGameBeganStarting);
            this.gameSocket.emit('updateTime',{time:this.timeTillStart});
        }
        this.doInputs();
    }
}

module.exports = {
    Game:Game
};
