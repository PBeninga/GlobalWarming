//import { setTimeout } from "timers";

class Game{
   constructor(room, roomid){
      this.players = [];
      this.time = new Date().getTime();
      this.room = room;
      this.map = new Map(); //WHATS GONNA HAPPEN HERE
      this.started = false;
      this.starting = false;
      this.roomid = roomid;
      this.finished =  false;
      this.winner = null;
      this.maxPlayers = 4;
      this.timeTillStart = 10000;
      this.startingCastles = [];
      this.timeGameBeganStarting = null;
   }
   onInputFired(data, id){
        if(this.map.nodes[data.nodes[0]].army && this.map.nodes[data.nodes[0]].army.count > 0 && this.map.nodes[data.nodes[0]].army.player == id && this.started){
            this.map.moveArmy(data.nodes, id);
        }
   }
   incrementTroops(num){
      this.map.incrementAllTroops(num);
   }
   moveArmy(nodes,player){
      this.map.moveArmy(nodes,player);
   }
   onPlayerDisconnect(){
      this.removePlayer(this.id);
   }
   removePlayer(id){
      if(!this.players.includes(id)){
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
      for(var i = 0; i < toRemove.length; i++){
         if(this.map.castles.indexOf(toRemove[i]) != -1){
            this.map.nodes[toRemove[i]].army = new Army(null,50);
         }else{
             this.map.nodes[toRemove[i]].army = null;
         } // set to neutral castle
      }

      this.players.splice(this.players.indexOf(id),1);

      //find any army in a path that is owned by removed player
      //NOT IMPLEMENTED
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
      this.players.push(id);
      this.map.nodes[destination].assignPlayer(id);
     
      return true;
   }
   endGame(){
       this.room.emit("endGame",{winner:this.winner});
   }
   tick(){ 
        this.room.emit('update_nodes', {nodes:this.map.nodes});

        var tickStartTime = new Date().getTime();
        if(tickStartTime - this.time >= 500){
           var troopsToAdd = Math.floor((tickStartTime -this.time)/500);
           this.time = tickStartTime;
        }
        
        if(this.players.length > 1 && !this.starting && !this.started){
            this.starting = true;
            console.log("Game starting.");
            let game = this;
            this.timeGameBeganStarting = new Date().getTime();
            setTimeout(function(){
                game.started = true;
                game.room.emit('startGame');
            }, 10*1000);
        }
        if(this.started){
            if(this.time == tickStartTime){
               this.incrementTroops(troopsToAdd);
            }
            //should be unncessary after pathTraversal is merged
            var playersInGame = [];
            for(var i = 0; i < this.map.nodes.length; i++){
                if(this.map.nodes[i].army){
                    if(playersInGame.indexOf(this.map.nodes[i].army.player) == -1 && this.map.nodes[i].army.player != null){
                        playersInGame.push(this.map.nodes[i].army.player);
                    }
                }
            }
            if(playersInGame.length <= 1 && game.started){
                if(playersInGame.length == 1){
                    this.winner = playersInGame[0];
                }
                game.finished = true;
            }      
        }else if(this.starting){
            this.timeTillStart = 10000 - (new Date().getTime() - this.timeGameBeganStarting);
            this.room.emit('updateTime',{time:this.timeTillStart});
        }
    }
}

class Map{
   constructor(){
      this.nodes = [];
      this.castles = [];//which indicies of nodes are castles;
      this.castlesChanged = [];
      //this.paths = [];
   }

   incrementAllTroops(num){
      for(var i = 0; i < this.nodes.length;i++){
         if(this.nodes[i].buff != null && this.nodes[i].army.player != null){
            this.nodes[i].army.count += num;
         }
      }
   }

   moveArmy(nodes,player){
      var startNode = this.nodes[nodes[0]];
      var endNode = this.nodes[nodes[1]];
      if(startNode.army.player == player){
         //if startNode is a castle only move half the troops
         if(startNode instanceof Castle){
            var toMove = Math.floor(startNode.army.count/2);
            startNode.army.count -= toMove;
         }else{ //move all the troops
            toMove = startNode.army.count;
            startNode.army = null;
         }

         //if end node is empty, add dummy army to be overwritten by moving troops
         if(endNode.army == null){
            endNode.army = new Army(null,0);
         }
         //if end node contains your army, just combine armies
         if(endNode.army.player == player){
            endNode.army.count += toMove;
         }else{ //battle
            //if enemy army is greater, decrease enemy army by your attacking army count
            if(endNode.army.count >= toMove){
               endNode.army.count -= toMove;
            }else{//conquer the node with your remaning troops (the difference)
               endNode.army = new Army(player,toMove-endNode.army.count);
            }
         }
      }
   }
}

class MapNode{
   constructor(x,y,adj){
      this.x = x;
      this.y = y;
      this.adj = adj;
      this.army = null;
   }
}

class Castle extends MapNode{
   constructor(x,y,adj){
      super(x,y,adj);
      this.army = new Army(null,50);
      this.buff='none';
   }

   assignPlayer(id){ //when player intially joins and is assigned a castle
      this.army = new Army(id,50);
   }
}

class Army{
   constructor(id,size){
      this.player = id;
      this.count = size;
      //this.buff = "swole";
   }
}
/*
//create game with a castle and an empty node
var game = new Game();
game.map.nodes = [new Castle(0,0,[1]),new MapNode(1,1,[0])];

//add player with id 2, they should be put in the castle.
console.log("\nAdd player 2\n");
game.addPlayer(2);
console.log(game);
console.log(game.map.nodes[0]);
console.log(game.map.nodes[1]);

//gives player 2, 100 troops
console.log("\nincrement troops\n");
game.incrementTroops(100);
console.log(game);
console.log(game.map.nodes[0]);
console.log(game.map.nodes[1]);

//player 2 swipes from castle to node
console.log("\nMove from player 2 to node\n");
game.moveArmy([0,1],2);
console.log(game);
console.log(game.map.nodes[0]);
console.log(game.map.nodes[1]);

//player 2 swipes back from node to castle
console.log("\nMove from node to player 2\n");
game.moveArmy([1,0],2);
console.log(game);
console.log(game.map.nodes[0]);
console.log(game.map.nodes[1]);

//attempts to remove player 3, even though they don't exist
console.log("\nRemove player 3\n");
game.removePlayer(3);
console.log(game);
console.log(game.map.nodes[0]);
console.log(game.map.nodes[1]);

//removes player 2
console.log("\nRemove player 2\n");
game.removePlayer(2);
console.log(game);
console.log(game.map.nodes[0]);
console.log(game.map.nodes[1]);

//does nothing since no one owns troops
console.log("\nincrement troops\n");
game.incrementTroops(1);
console.log(game);
console.log(game.map.nodes[0]);
console.log(game.map.nodes[1]);

*/

/*
NOT IMPLEMENTED
class Path{
   constructor(nodeA,nodeB){
      this.nodes = [];
      this.nodes.push(nodeA);
      this.nodes.push(nodeB);
      this.armies = [];
   }
   //movements
}

class Army{
   constructor(id,size){
      this.player = id;
      this.troops = size;
      this.buff = "swole";
   }
}
*/

module.exports = {
    MapNode:MapNode,
    Game:Game,
    //Path:Path,
    Army:Army,
    Castle:Castle
};
