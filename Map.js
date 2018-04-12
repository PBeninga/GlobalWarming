class Map{
   constructor(){
      this.nodes = [];
      this.castles = [];//which indicies of nodes are castles;
      this.startingCastles = [];//which of the castles are suitable for starting positions
      this.buffer = [];
      //this.paths = [];
      this.makeMap();
   }
   
   makeMap(){
       var nodes = [];
       var high = 5;
       var count = 0;
       var castles = [0,4,24,20,10,14,12,2,22,18,6];
       for(var i = 1; i <= high; i++){
           for(var j = 1; j <= high; j++){
               let x =  i*100;
               let y =  j*100;
               var adj = [];
               // If the node isn't on the left layer, push the node on the left.
               if(i != 1){
                   adj.push(count-5);
               }
               // If the node isn't on the top layer, push the node on top.
               if(j != 1){
                   adj.push(count-1);
               }
               // If the node isn't on the right layer, push the node on the right.
               if(i < high){
                   adj.push(count+5);
               }
               // If the node isn't on the bottom layer, push the node on bottom.
               if(j < high){
                   adj.push(count+1);
               }
               if(castles.indexOf(count) == -1){
                   nodes[count] = new MapNode(x,y,adj, count);
               }else{
                   nodes[count] = new Castle(x,y,adj, count);
               }
               count++;
           }
       }
       this.startingCastles = [0,24,4,20];
       this.nodes = nodes;
       this.castles = castles;
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

module.exports = {
    MapNode:MapNode,
    Castle:Castle,
    Map:Map
};
