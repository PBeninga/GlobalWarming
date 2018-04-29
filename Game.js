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

      this.map = new gameMap.MapFactory().getMap(null);
      this.playerPool = new playerObject.PlayerPool();
      this.dummyPlayer = this.playerPool.addPlayer(null);
      this.movingArmies = [];
      this.battles = [];
      for(var i = 0; i < this.map.castles.length; i++){
         this.map.nodes[this.map.castles[i]].army = this.dummyPlayer.addArmy(50, this.map.nodes[this.map.castles[i]]);
      }

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
      if(this.map.nodes[moveNodes[0]].army && //the start node has an army
         this.map.nodes[moveNodes[0]].army.count > 0 && //the start node's army has enough troops
         this.map.nodes[moveNodes[0]].army.player == id && //the start node's army is equal to
         this.started){
            this.queueMoveArmy(moveNodes, this.map.nodes[moveNodes[0]].army.id, this.playerPool.getPlayer(id));
         }
      }

      // Increments all armies that have the 'castle' buff
      incrementTroops(num){
         for(var i = 0; i < this.playerPool.activePlayers.length; i++) {
            this.playerPool.activePlayers[i].incrementArmies(num);
         }
      }

      // Adds the given input to the queue of inputs to be processed in tick()
      queueMoveArmy(nodes, armyID, player){
         //TODO: Fix hacky solution
         var currentPlayerArmyListLength = player.armies.length;
         var movingArmy = player.moveArmy(armyID, this.map.nodes[nodes[0]]);
         if(currentPlayerArmyListLength == player.armies.length) {
            this.map.nodes[nodes[0]].army = null;
         }
         // nodes - the indices of nodes of the swipe path
         // army - the server object of the army
         this.movingArmies.push({nodes:nodes, army:movingArmy, percentage:0});
      }

      // Moves the given army the given percent between the start and end nodes. Return the percent complete.
      moveArmy(army, startNode, endNode, percent) {
         if(percent >= 100) {
            percent = 100;
         }
         var xDist = endNode.x - startNode.x;
         var yDist = endNode.y - startNode.y;
         army.x = startNode.x + (xDist * (percent/100));
         army.y = startNode.y + (yDist * (percent/100));
         return percent;
      }

      onPlayerDisconnect(){
         this.removePlayer(this.id);
      }

      removePlayer(id){
         if(!this.playerPool.containsActive(id)){
            console.log("Attempting to remove player that doesn't exist.");
            return false;
         }
         console.log("removing player " + id + " from game " + this.roomid);
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
         this.playerPool.removePlayer(id);
      }

      //return true on player succesfully added
      addPlayer(id){
         if(this.playerPool.containsActive(id)){
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
         if(destination == -1 || this.playerPool.activePlayers.length == this.maxPlayers){
            console.log("Could not find a castle.");
            return false;
         }
         console.log("Player assigned castle.");
         var player = this.playerPool.addPlayer(id);
         this.dummyPlayer.removeArmyAtNode(this.map.nodes[destination]);
         this.map.nodes[destination].army = player.addArmy(50,this.map.nodes[destination]);
         return true;
      }

      endGame(){
         this.gameSocket.emit("endGame",{winner:this.winner});
      }

      // Conducts a battle between two armies for the node. Removes the loser from the players list and
      // puts the winner into the node, giving it the node's buff
      battle(node, army1, army2) {
         var battleLoser = army1.battle(army2);
         var losingPlayer = null;
         if(army1.id == battleLoser.id) {
            node.army = army2;
            army2.buff = node.buff;
            army2.x = node.x;
            army2.y = node.y;
            console.log("Battle is removing army " + army1.id + " from " + army1.player);
            losingPlayer = this.playerPool.getPlayer(army1.player);
            losingPlayer.removeArmy(army1.id);
         }
         else {
            node.army = army1;
            army1.buff = node.buff;
            army1.x = node.x;
            army1.y = node.y;
            console.log("Battle is removing army " + army2.id + " from " + army2.player);
            losingPlayer = this.playerPool.getPlayer(army2.player);
            losingPlayer.removeArmy(army2.id);
         }
         if(losingPlayer.armies.length == 0) {
            this.playerPool.removePlayer(id);
         }
      }

      tick(){
         var troopsToAdd = 0;
         this.gameSocket.emit('update_armies', {players:this.playerPool.activePlayers});

         var tickStartTime = new Date().getTime();
         if(tickStartTime - this.time >= 500){
            troopsToAdd = Math.floor((tickStartTime -this.time)/500);
            this.time = tickStartTime - (tickStartTime%500);
         }
         // If there are more than 1 player (DummyPlayer doesnt count) and the game isn't started or starting
         if(this.playerPool.activePlayers.length > 2 && !this.starting && !this.started){
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
            // Move all the armies (Done backwards because of splicing within for loop)
            for(var i = this.movingArmies.length - 1; i >= 0; i--){
               var currentMoving = this.movingArmies[i];
               var startNode = this.map.nodes[currentMoving.nodes[0]];
               var endNode = this.map.nodes[currentMoving.nodes[1]];
               currentMoving.percentage += 5;
               // if the army is done moving
               if(this.moveArmy(currentMoving.army, startNode, endNode, currentMoving.percentage) >= 100){
                  // Adds a dummy army for the army to "fight" if none exists
                  if(endNode.army == null) {
                     endNode.army = this.dummyPlayer.addArmy(0, endNode);
                     console.log("Created army " + endNode.army.id + " as a dummy army");
                  }
                  //battle the occupying army
                  this.battle(endNode, currentMoving.army, endNode.army);
                  //Remove the finished movingArmy from the list
                  var finished  = this.movingArmies.splice(i,1)[0];
                  //Call moveArmies again if the swipelist continues
                  if(finished.nodes.length > 2){
                     finished.nodes.shift();
                     this.queueMoveArmy(finished.nodes, finished.army.id, this.playerPool.getPlayer(finished.army.player));
                  }
               }
            }
            // Check for end condition (1 Player + DummyPlayer remaining)
            //TODO: Change to check for 2 Players and no Dummy Player
            if(this.playerPool.activePlayers.length <= 2 && this.started){
               this.winner = this.playerPool.activePlayers[1].id;
               this.finished = true;
            }
         } else if(this.starting){
            this.timeTillStart = this.constTimeTillStart - (new Date().getTime() - this.timeGameBeganStarting);
            this.gameSocket.emit('updateTime',{time:this.timeTillStart});
         }
      }
   }

   module.exports = {
      Game:Game
   };
