class Map{
   constructor(){
      this.nodes = [];
      this.castles = [];//which indicies of nodes are castles;
      this.startingCastles = [];//which of the castles are suitable for starting positions
      this.buffer = [];
      //this.paths = [];
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

   validPath(nodeid) {
     for(var i = 0; i < this.adj.length; i++) {
       if(nodeid == adj[i]) {
         return true;
       }
     }
     return false;
   }
}

class Castle extends MapNode{
   constructor(x,y,adj,id){
      super(x,y,adj,id);
      this.buff = 'castle';
   }
}

module.exports = {
    MapNode:MapNode,
    Castle:Castle,
    Map:Map
};
