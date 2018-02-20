class Game{
   constructor(){
      this.players = [];
      this.time = 0;
      this.map = new Map('map.json');
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
      this.fillMap();
   }

   incrementAllTroops(num){
      for(int i = 0; i < this.nodes.length();i++){
         if(this.nodes[i] instanceof Castle){
            this.nodes[i].army.troops += num;
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

   moveArmy(){
      //MOVE WHOLE ARMY
   }
}

class Castle extends MapNode{
   constructor(){
      super();
   }

   assignPlayer(id){ //when player intially joins and is assigned a castle
      this.army = new Army(id,50);
   }

   generateTroops(){

   }

   moveArmy(){
      //Move Half Army
   }
}

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
