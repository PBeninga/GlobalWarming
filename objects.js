//import { setTimeout } from "timers";

class Game{
   constructor(){
      this.players = [];
      this.time = 0;
      this.map = new Map(); //WHATS GONNA HAPPEN HERE
      this.finished =  false;
   }

   incrementTroops(num){
      this.map.incrementAllTroops(num);
   }

   moveArmy(nodes,player){
      this.map.moveArmy(nodes,player);
   }

   removePlayer(id){
      if(!this.players.includes(id)){
         console.log("Attempting to remove player that doesn't exist.");
         return;
      }

      //find any army in a mapnode that is owned by removed player
      var toRemove = [];
      for(var i = 0; i < this.map.nodes.length; i++){
         if(this.map.nodes[i].army != null && this.map.nodes[i].army.player == id){
            toRemove.push(i);
         }
      }
      for(var i = 0; i < toRemove.length; i++){
         this.map.nodes[toRemove[i]].army = new Army(null,50); // set to neutral castle
      }

      this.players.splice(this.players.indexOf(id),1);

      //find any army in a path that is owned by removed player
      //NOT IMPLEMENTED
   }

   addPlayer(id){
      if(this.players.includes(id)){
         console.log("Attempting to add player that already exists.");
         return;
      }
      //finds first node that is a castle, not owned by another player, and assigns it to the new player.
      //***need to check if castle is being attacked
      for(var i = 0; i < this.map.nodes.length; i++){
         if(this.map.nodes[i].buff != null && this.map.nodes[i].army.player == null){
            var destination = i;
            break;
         }
      }
      this.players.push(id);
      this.map.nodes[destination].assignPlayer(id);
   }
   tick(io){
       this.incrementTroops(1);
       io.local.emit('update_nodes', {nodes:this.map.nodes});
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
