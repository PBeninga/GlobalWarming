var armyObject = require('./Army.js');

class Map{
   constructor(){
      this.nodes = [];
      this.castles = [];//which indicies of nodes are castles;
      this.castlesChanged = [];
      this.buffer = [];
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
      if(startNode.army.player == player.id){
         //if startNode is a castle only move half the troops
         if(startNode instanceof Castle){
            var toMove = Math.floor(startNode.army.count/2);
            startNode.army.count -= toMove;
         }else{ //move all the troops
            toMove = startNode.army.count;
            player.armies.splice(player.findArmyIndexById(startNode.army.id),1);
            startNode.army = null;
         }
         this.buffer.push({nodes:nodes, army:new armyObject.Army(player, toMove), percentage:0});

         //if end node is empty, add dummy army to be overwritten by moving troops
        //  if(endNode.army == null){
        //     endNode.army = new Army(null,0);
        //  }
        //  //if end node contains your army, just combine armies
        //  if(endNode.army.player == player){
        //     endNode.army.count += toMove;
        //  }else{ //battle
        //     //if enemy army is greater, decrease enemy army by your attacking army count
        //     if(endNode.army.count >= toMove){
        //        endNode.army.count -= toMove;
        //     }else{//conquer the node with your remaning troops (the difference)
        //        endNode.army = new Army(player,toMove-endNode.army.count);
        //     }
        //  }
      }
   }

    finishedMovingArmy(nodes,army){
        let endNode = this.nodes[nodes[1]];
        if(endNode.army == null){
            endNode.army = new armyObject.Army(null,0);
         }
         //if end node contains your army, just combine armies
         if(endNode.army == null){
             endNode.army = new armyObject.Army(null,0);
        }
         if(endNode.army.player == army.player){
            endNode.army.count += army.count;
         }else{ //battle
            //if enemy army is greater, decrease enemy army by your attacking army count
            if(endNode.army.count >= army.count){
               endNode.army.count -= army.count;
            }else{//conquer the node with your remaning troops (the difference)
               army.count -= endNode.army.count;
               endNode.army = army;
            }
        }
    }
}
class MapNode{
   constructor(x,y,adj, id){
      this.id = id;
      this.x = x;
      this.y = y;
      this.adj = adj;
      this.army = null;
   }
}

class Castle extends MapNode{
   constructor(x,y,adj, id){
      super(x,y,adj, id);
      this.army = new armyObject.Army(null,50);
      this.buff='none';
   }

   assignPlayer(player){ //when player intially joins and is assigned a castle
      this.army = new armyObject.Army(player,50);
   }
}

module.exports = {
    MapNode:MapNode,
    Castle:Castle,
    Map:Map
};
