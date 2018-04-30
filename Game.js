var gameMap = require('./Map.js');
var miscFunc = require('./MiscFunctions.js');
var armyObject = require('./Army.js');
var playerObject = require('./Player.js');
var movingArmyObject = require('./MovingArmy.js');
var battleObject = require('./Battle.js');
const fs = require('fs');

// Global Constants
let tickLength = 50;
let CONSTANT_TIME_TILL_START = 3000;

class Game{
    // TODO create a state variable

   constructor(removeGame, io){
      let id = "/"+miscFunc.generateID(20)
	  let gameSocket = io.of(id);
      this.roomid = id;
      this.gameSocket = gameSocket;
      this.removeGame = removeGame;

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
      //Game Variables
      this.maxPlayers = 4;
      this.timeTillStart = 3000;
      this.timeGameBeganStarting = null;
      this.time = new Date().getTime();

      this.running = true;
      this.tickParent(this);
   }

   // TODO: add checking for if the client tries to send an incorrect swipe
   addInput(moveNodes, id){
      if(this.map.nodes[moveNodes[0]].army && //the start node has an army
         this.map.nodes[moveNodes[0]].army.count > 0 && //the start node's army has enough troops
         this.map.nodes[moveNodes[0]].army.player == id && //the start node's army is equal to the sending sockets id
         this.started){
            var swipePath = new Array();
            // converts the moveNodes list from nodeIds to x and y variables
            for(var i = 0; i < moveNodes.length; i++) {
               swipePath.push({x:this.map.nodes[moveNodes[i]].x, y:this.map.nodes[moveNodes[i]].y});
            }
            // Gets the army to be moved, and removes it from its node if necessary
            var player = this.playerPool.getPlayer(id);
            var currentPlayerArmyListLength = player.armies.length;
            var movingArmy = player.moveArmy(this.map.nodes[moveNodes[0]].army.id, this.map.nodes[moveNodes[0]]);
            if(currentPlayerArmyListLength == player.armies.length) {
               this.map.nodes[moveNodes[0]].army = null;
            }
            this.movingArmies.push(new movingArmyObject.MovingArmy(movingArmy, swipePath, moveNodes));
         }
      }

      // Increments all armies that have the 'castle' buff
      incrementTroops(num){
         for(var i = 0; i < this.playerPool.activePlayers.length; i++) {
            this.playerPool.activePlayers[i].incrementArmies(num);
         }
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
               this.map.nodes[toRemove[i]].army = new armyObject.Army(this.dummyPlayer,50,this.map.nodes[toRemove[i]]);
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
       this.running = false;
       this.removeGame(this.roomid);
       var winner = null;
       for(var i = 0; i < this.playerPool.activePlayers.length; i++) {
          if(this.playerPool.activePlayers[i].id != null) {
             winner = this.playerPool.activePlayers[i].id;
          }
       }
       console.log()
       this.gameSocket.emit("endGame",{winner:winner});
   }

   tickChild(){
      var troopsToAdd = 0;
      this.gameSocket.emit('update_armies', {players:this.playerPool.activePlayers});

         var tickStartTime = new Date().getTime();
         if(tickStartTime - this.time >= 500){
            troopsToAdd = Math.floor((tickStartTime -this.time)/100); //return to 500
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
            }, CONSTANT_TIME_TILL_START);
         }
         if(this.started){
            if(troopsToAdd > 0){
               this.incrementTroops(troopsToAdd);
            }
            // Move all the armies (Done backwards because of splicing within for loop)
            // TODO: Make this not viscerally disgusting
            for(var i = this.movingArmies.length - 1; i >= 0; i--){
               var currentArmy = this.movingArmies[i];
               var crossed = new Array();
               // Creates a list of every MovingArmy moving opposite the current MovingArmy
               for(var j = 0; j < this.movingArmies.length; j++) {
                  if((this.movingArmies[j].nodeList[this.movingArmies[j].startIndex] == currentArmy.nodeList[currentArmy.startIndex + 1])
                     && (this.movingArmies[j].nodeList[this.movingArmies[j].startIndex + 1] == currentArmy.nodeList[currentArmy.startIndex])
                     && (j != i)
                     && (this.movingArmies[j].player != currentArmy.player)) {
                     // Adds the crossing armies index and current MovingArmys x and y position
                     crossed.push({index:j, x:currentArmy.army.x, y:currentArmy.army.y});
                  }
               }
               // Ticks the MovingArmy and checks for completion
               if(!currentArmy.tick()) {
                  var currentNode = this.map.nodes[currentArmy.nodeList[currentArmy.startIndex+1]]; // The ending node of the MovingArmy
                  // if the node is occupied, initialize a battle and remove the MovingArmy from the list
                  if(currentNode.army != null) {
                     // If the current Node's army is the players, don't start a battle.
                     if(currentArmy.army.player == currentNode.army.player) {
                        currentNode.army.count += currentArmy.army.count;
                        this.playerPool.getPlayer(currentArmy.army.player).removeArmy(currentArmy.army.id);
                        console.log("Removed Army");
                        this.movingArmies.splice(i,1);
                     }
                     else {
                        this.battles.push(new battleObject.Battle(
                           currentArmy.army, this.playerPool.getPlayer(currentArmy.army.player),
                           currentNode.army, this.playerPool.getPlayer(currentNode.army.player),
                           currentArmy.army.x, currentArmy.army.y,
                           currentNode
                        ));
                        console.log("Removed Army");
                        this.movingArmies.splice(i,1);
                     }
                  }
                  // Otherwise, check to see if the MovingArmy has reached its destination
                  else if(!currentArmy.moveUpList()) {
                     // If it has, remove it from the list and add it to the final nodes army variable
                     var finished  = this.movingArmies.splice(i,1)[0];
                     this.map.nodes[finished.nodeList[finished.nodeList.length-1]].army = finished.army;
                  }
               }
               // If the army isn't done moving, check the list of crossing armies to see if they've met yet
               else {
                  for(var j = 0; j < crossed.length; j++) {
                     // If they have met, create a new battle object and remove both armies from the movingarmies list
                     if(
                        ((currentArmy.x > this.movingArmies[crossed.index].x) != (currentArmy.x > crossed.x))
                     || ((currentArmy.y > this.movingArmies[crossed.index].y) != (currentArmy.y > crossed.y))
                     ) {
                        this.battles.push(new battleObject.Battle(
                           currentArmy.army, this.playerPool.getPlayer(currentArmy.army.player),
                           this.movingArmies[crossed.index], this.playerPool.getPlayer(this.movingArmies[crossed.index].player),
                           currentArmy.army.x, currentArmy.army.y,
                           null
                        ));
                        this.movingArmies.splice(i,1);
                        this.movingArmies.splice(crossed.index, 1);
                        if(crossed.index < i) {
                           i--;
                        }
                     }
                  }
               }
            }
            for(var i = this.battles.length - 1; i >= 0; i--) {
               if(!this.battles[i].tick()) {
                  console.log("Removed a battle");
                  this.battles.splice(i, 1);
               }
            }
            for(var i = 0; i < this.playerPool.activePlayers.length; i++) {
               if(this.playerPool.activePlayers[i].armies.length == 0) {
                  this.playerPool.removePlayer(this.playerPool.activePlayers[i].id);
               }
            }
            // Check for end condition (1 Player + DummyPlayer remaining)
            //TODO: Change to check for 2 Players and no Dummy Player
            if(this.playerPool.activePlayers.length <= 2 && this.started){
               this.winner = this.playerPool.activePlayers[1].id;
               this.endGame();
            }
         } else if(this.starting){
            this.timeTillStart = CONSTANT_TIME_TILL_START - (new Date().getTime() - this.timeGameBeganStarting);
            this.gameSocket.emit('updateTime',{time:this.timeTillStart});
         }
      }

    tickParent(game){

       var startTime = new Date().getTime();

       game.tickChild();

       if( game.running ){
           game.forceTickRate(startTime, game); // Wait until the minimum tick-time has passed
       }

    }

    forceTickRate(startTime, game){

        var tickTime =  new Date().getTime() - startTime;

        if(tickTime < 0){
            tickTime = 0;
        }

       if(tickTime > tickLength){
          console.log("Dropping Frame");
          setTimeout(game.tickParent,(Math.floor(tickTime/tickLength)+1)*tickLength-tickTime, game);
       }else{
          setTimeout(game.tickParent, tickLength-tickTime, game);
       }

    }

}

///////////////////////////////////////////////////////////////////////////////
// Tick functions

   module.exports = {
      Game:Game
   };
