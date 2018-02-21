class Game{
   constructor(){
      this.players = [];
      this.time = 0;
      this.map = new Map(); //WHATS GONNA HAPPEN HERE
   }

   incrementTroops(num){
      this.map.incrementAllTroops(num);
   }

   removePlayer(id){
      if(!this.players.includes(id)){
         console.log("Attempting to remove player that doesn't exist.");
         return;
      }

      //find any army in a mapnode that is owned by removed player
      var toRemove = [];
      for(var mapnode in this.map.nodes){
         if(mapnode.army != null && mapnode.army.player == id){
            toRemove.push(this.map.nodes.indexOf(mapnode));
         }
      }
      for(var index in toRemove){
         this.map.nodes[index].army = new Army(null,50); // set to neutral castle
      }

      //find any army in a path that is owned by removed player
      //NOT IMPLEMENTED
      }
   }

   addPlayer(id){
      //finds first node that is a castle, not owned by another player, and assigns it to the new player.
      //***need to check if castle is being attacked
      for(var mapnode in this.map.nodes){
         if(mapnode instanceof Castle && mapnode.army.player == null){
            var destination = this.map.nodes.indexOf(mapnode);
            break;
         }
      }
      this.map.nodes[destination].assignPlayer(id);
   }
}

class Map{
   constructor(){
      this.nodes = [];
      this.paths = [];
   }

   incrementAllTroops(num){
      for(var i = 0; i < this.nodes.length();i++){
         if(this.nodes[i] instanceof Castle){
            this.nodes[i].army.count += num;
         }
      }
   }

   moveArmy(nodes,player){
      startNode = this.nodes[nodes[0]];
      endNode = this.nodes[nodes[1]];
      if(startNode.army.player == player){
         //if startNode is a castle only move half the troops
         if(startNode instanceof Castle){
            toMove = Math.floor(startNode.army.count/2);
            startNode.army.count -= toMove;
         }else{ //move all the troops
            toMove = startNode.army.count;
         }

         //if end node contains your army, just combine armies
         if(endNode.army.player == player){
            endNode.army.count += toMove;
         }else{ //battle
            //if enemy army is greater, decrease enemy army by your attacking army count
            if(endNode.army.count >= toMove{
               endNode.army.count -= toMove;
            }else{//conquer the node with your remaning troops (the difference)
               endNode.army = new Army(player,toMove-endNode.army.count);
            }
         }
      }
   }
}

class MapNode{
   constructor(x,y){
      this.x = x;
      this.y = y;
      this.adj = null;
      this.army = null;
   }
}

class Castle extends MapNode{
   constructor(){
      super();
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

//NOT IMPLEMENTED 
/*
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
module.exports = {
    MapNode:MapNode,
    Game:Game,
    Path:Path,
    Army:Army
};
