class Map{
   constructor(){
      this.nodes = [];
      this.castles = [];//which indicies of nodes are castles;
      this.startingCastles = [];//which of the castles are suitable for starting positions
      this.buffer = [];
      //this.paths = [];
      this.readMap();
      //this.makeMap();
   }
   
   readMap(){
      const fs = require("fs");
      var buffer = JSON.parse(fs.readFileSync("./maps/random.txt", "utf-8"));
      
      this.castles = buffer.castles;
      this.startingCastles = buffer.startingCastles;
      
      for(var i=0; i<buffer.nodes.length; i++){
         var tNode = buffer.nodes[i];
         if(this.castles.indexOf(i) == -1){
             this.nodes[i] = new MapNode(tNode.x, tNode.y, tNode.adj, i);
         }else{
             this.nodes[i] = new Castle(tNode.x, tNode.y, tNode.adj, i);
         }
      }
      
   }
}
class MapNode{
   constructor(x,y,adj,id){
      this.id = id;
      this.x = x;
      this.y = y;
      this.adj = adj;
      this.buff = null;
      this.army = null;
   }

   // Checks for a valid path to the given node
   validPath(nodeid) {
     for(var i = 0; i < this.adj.length; i++) {
       if(nodeid == adj[i]) {
         return true;
       }
     }
     return false;
   }
}

// Just MapNode, but with a buff
class Castle extends MapNode{
   constructor(x,y,adj,id){
      super(x,y,adj,id);
      this.buff = 'castle';
   }
}

// For unit testing
module.exports = {
    MapNode:MapNode,
    Castle:Castle,
    Map:Map
};
