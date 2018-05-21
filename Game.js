var gameMap = require('./Map.js');
var miscFunc = require('./MiscFunctions.js');
var armyObject = require('./Army.js');
var playerObject = require('./Player.js');
var movingArmyObject = require('./MovingArmy.js');
var battleObject = require('./Battle.js');
const fs = require('fs');

// Global Constants
let tickLength = 50;
let TIME_TILL_START = 3000;

let STATE_WAITING = 0;
let STATE_COUNT_DOWN = 1;
let STATE_RUNNING = 2;
let STATE_GAME_OVER = 3;

let MAX_PLAYERS = 4;

class Game{


 ////////////////////////////////////////////////////////////
 // CONSTRUCTOR

   constructor(removeGame, io){
      let id = "/"+miscFunc.generateID(20)
      let gameSocket = io.of(id);
      this.roomid = id;
      this.gameSocket = gameSocket;
      this.removeGame = removeGame;  // This is a callback to app.js

      //Useful game data
      this.map = new gameMap.MapFactory().getMap(null);
      this.playerPool = new playerObject.PlayerPool();
      this.dummyPlayer = this.playerPool.addPlayer(new playerObject.Player(null, null));
      this.movingArmies = [];
      this.battles = [];
      for(var i = 0; i < this.map.castles.length; i++){
         this.map.nodes[this.map.castles[i]].army = this.dummyPlayer.addArmy(50, this.map.nodes[this.map.castles[i]]);
      }

      //Game Variables
      this.gameState = STATE_WAITING;
      this.tick();
   }

   // TODO: add checking for if the client tries to send an incorrect swipe
   addInput(moveNodes, id){
      if(this.map.nodes[moveNodes[0]].army && //the start node has an army
         this.map.nodes[moveNodes[0]].army.count > 0 && //the start node's army has enough troops
         this.map.nodes[moveNodes[0]].army.player == id && //the start node's army is equal to the sending sockets id
         this.gameState == STATE_RUNNING){
         // Gets the army to be moved, and removes it from its node if necessary
         var player = this.playerPool.getPlayer(id);
         var currentPlayerArmyListLength = player.armies.length;
         var movingArmy = player.moveArmy(this.map.nodes[moveNodes[0]].army.id, this.map.nodes[moveNodes[0]]);
         if(currentPlayerArmyListLength == player.armies.length) {
            this.map.nodes[moveNodes[0]].army = null;
         }
         this.movingArmies.push(new movingArmyObject.MovingArmy(movingArmy, this.map.nodeToXY(moveNodes), moveNodes));
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
   addPlayer(player){
      if(this.playerPool.containsActive(player.id)){
         console.log("Attempting to add player that already exists.");
         return false;
      }
      //finds first node that is a castle, not owned by another player, and assigns it to the new player.
      //***need to check if castle is being attacked
      var startingNode = this.map.getStartingCastle();
      if(startingNode == null || this.playerPool.activePlayers.length == MAX_PLAYERS){
         console.log("Could not find a castle.");
         return false;
      }
      console.log("Player assigned castle.");
      var gamePlayer = this.playerPool.addPlayer(player);
      this.dummyPlayer.removeArmyAtNode(startingNode);
      startingNode.army = gamePlayer.addArmy(50,startingNode);
      return true;
   }


 //////////////////////////////////////////////////////////////////////////////////////
 // TICK FUNCTIONS
 //

   tick(){

      var tickStartTime = new Date().getTime();

      if(this.gameState == STATE_WAITING){
         this.waitingState();
      }

      if(this.gameState == STATE_COUNT_DOWN){
         this.countDownTimer();
      }

      if(this.gameState == STATE_RUNNING){
         this.gameSocket.emit('players', {players:this.playerPool.activePlayers});
         this.incrementTroops(tickStartTime);
         this.moveArmies();
         this.checkCollisions();
         this.checkGameOver();
         this.garbageCollection();
      }

      this.gameSocket.emit('update_armies', {players:this.playerPool.activePlayers});
      this.forceTickRate(tickStartTime); // Wait until min tick-time has passed
   }

   moveArmies(){
      // Move all the armies (Done backwards because of splicing within for loop)
      for(var i = this.movingArmies.length - 1; i >= 0; i--){
         var currentArmy = this.movingArmies[i];
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
                  console.log("Battle At Node");
                  this.battles.push(new battleObject.Battle(
                     currentArmy.army, this.playerPool.getPlayer(currentArmy.army.player), null,
                     currentNode.army, this.playerPool.getPlayer(currentNode.army.player), null,
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
      }
   }

   checkCollisions() {
      for(var i = 0; i < this.movingArmies.length; i++) {
         var currentArmy = this.movingArmies[i];
         for(var j = 0; j < this.movingArmies.length; j++) {
            //Not counting the army we're checking
            if(j == i) {
               continue;
            }
            if(currentArmy.army.checkCollision(this.movingArmies[j].army.x, this.movingArmies[j].army.y)) {
               this.battles.push(new battleObject.Battle(
                  currentArmy.army, this.playerPool.getPlayer(currentArmy.army.player), currentArmy.nodeList.slice(currentArmy.startIndex),
                  this.movingArmies[j].army, this.playerPool.getPlayer(this.movingArmies[j].army.player), this.movingArmies[j].nodeList.slice(this.movingArmies[j].startIndex),
                  currentArmy.army.x, currentArmy.army.y,
                  null
               ));
               if(i < j) {
                  this.movingArmies.splice(j,1);
                  this.movingArmies.splice(i,1);
               }
               else {
                  this.movingArmies.splice(i,1);
                  this.movingArmies.splice(j,1);
               }
               // Used to make sure that the for loop doesn't go out of whack
               if(j < i) {
                  i--;
               }
               break;
            }
         }
      }
   }

   /////////////////////////////
   // WAITING STATE TICK FUNCTIONS

   waitingState(){

      // If there are more than 1 player (DummyPlayer doesnt count) and the game isn't started or starting

      if(this.playerPool.activePlayers.length >2){

         this.gameState = STATE_COUNT_DOWN;
         console.log("Game starting.");
         let game = this;
         this.gameStartTime = new Date().getTime();
         setTimeout(function(){
            game.lastTroopIncTime = new Date().getTime();
            game.gameState = STATE_RUNNING;
            game.gameSocket.emit('startGame');
         }, TIME_TILL_START, game);
      }
   }

   /////////////////////////////
   // RUNNING STATE TICK FUNCTIONS

   // Increments all armies that have the 'castle' buff
   incrementTroops(tickStartTime){
      //Adds troops based on time not tick
      var troopsToAdd = 0;
      if(tickStartTime - this.lastTroopIncTime >= 500){
         troopsToAdd = Math.floor((tickStartTime -this.lastTroopIncTime)/100); //return to 500
         this.lastTroopIncTime = tickStartTime - (tickStartTime%500);
      }

      if(troopsToAdd > 0){

         for(var i = 0; i < this.playerPool.activePlayers.length; i++) {
            this.playerPool.activePlayers[i].incrementArmies(troopsToAdd);
         }
      }
   }


   checkGameOver(){
      // Check for end condition (1 Player + DummyPlayer remaining)
      //TODO: Change to check for 2 Players and no Dummy Player
      if(this.playerPool.activePlayers.length <= 2 && this.gameState == STATE_RUNNING){
         this.winner = this.playerPool.activePlayers[1].id;
         this.gameState = STATE_GAME_OVER;
         this.removeGame(this.roomid);
         var winner = null;
         for(var i = 0; i < this.playerPool.activePlayers.length; i++) {
            if(this.playerPool.activePlayers[i].id != null) {
               winner = this.playerPool.activePlayers[i].id;
            }
         }
         console.log("Game has ended");
         this.gameSocket.emit("endGame",{winner:winner});
      }
   }

   garbageCollection(){
      // Removes
      // Players, Battles ...
      // From their respective arrays

      for(var i = this.battles.length - 1; i >= 0; i--) {
         if(!(this.battles[i].tick())) {
            var removedBattle = this.battles.splice(i, 1)[0];
            if(removedBattle.moveArmy == 1) {
               this.movingArmies.push(new movingArmyObject.MovingArmy(removedBattle.army1, this.map.nodeToXY(removedBattle.swipeList1), removedBattle.swipeList1));
            }
            if(removedBattle.moveArmy == 2) {
               this.movingArmies.push(new movingArmyObject.MovingArmy(removedBattle.army2, this.map.nodeToXY(removedBattle.swipeList2), removedBattle.swipeList2));
            }
            console.log("Removed a battle");
         }
      }
      for(var i = 0; i < this.playerPool.activePlayers.length; i++) {
         if(this.playerPool.activePlayers[i].armies.length == 0) {
            this.playerPool.removePlayer(this.playerPool.activePlayers[i].id);
         }
      }

   }


   /////////////////////////////
   // COUNT DOWN STATE TICK FUNCTIONS

   countDownTimer(){
      this.timeTillStart = TIME_TILL_START - (new Date().getTime() -this.gameStartTime);
      this.gameSocket.emit('updateTime',{time:this.timeTillStart});
   }


   /////////////////////////////
   // GAME OVER STATE TICK FUNCTIONS


   /////////////////////////////
   // GENERAL TICK FUNCTIONS

   forceTickRate(tickStartTime){
      // If the game is over, do not force another tick
      if( this.gameState == STATE_GAME_OVER ){
         return;
      }
      var tickTime =  new Date().getTime() - tickStartTime;
      if(tickTime < 0){
         tickTime = 0;
      }
      var game = this;
      if(tickTime > tickLength){
         console.log("Dropping Frame");
         setTimeout(this.tickCaller,(Math.floor(tickTime/tickLength)+1)*tickLength-tickTime, game);
      }else{
         setTimeout(this.tickCaller, tickLength-tickTime, game);
      }
   }

   // This is a callback for setTimeout
   // so it executes in a different class
   tickCaller(game){
      game.tick();
   }

}


module.exports = {
   Game:Game
};
