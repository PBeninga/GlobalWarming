class Game{
   constructor(){
      this.players = [];
      this.time = 0;
      this.map = new Map();
   }

   tick(){
      this.map.update();
   }

   removePlayer(id){
      var toRemove = [];
      if(!this.players.includes(id)){
         console.log("Attempting to remove player that doesn't exist.");
         return;
      }
      for(mapnode in this.map.nodes){
         if(mapnode.army != null && mapnode.army.player == id){
            mapnode.army = null;
         }
      }
   }

   addPlayer(){

   }
}

class Map{
   constructor(){
      this.nodes = [];
      this.paths = [];
      this.fillMap();
   }

   fillMap(){

   }
}

class MapNode{
   constructor(){
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
