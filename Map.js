var locationClass = require('./Location.js');
//we use a factory incase we want to subclass specfic maps to have them do certain things
class MapFactory{
   constructor(){
      this.mapNames = ["inOut", "innerRing",
                       "random",	"threeByThree",	"twoByTwo", "fourPlayer"];
      this.map = null;
   }
  getMap(specifier){
    this.map = new Map();
    if(this.mapNames.includes(specifier)){
      this.map.readMap(specifier);
    }
    else{
      let num = Math.floor(Math.random() * this.mapNames.length);
      let mapString = this.mapNames[Math.floor(Math.random() * this.mapNames.length)];
      //this.map.readMap(mapString);
      this.map.readMap("fourPlayer");
    }
    return this.map;
  }
}
class Map{
   constructor(){
      this.nodes = [];
      this.castles = [];//which indicies of nodes are castles;
      this.startingCastles = [];//which of the castles are suitable for starting positions
      this.buffer = [];
      //this.paths = [];
      //this.makeMap();
   }

   getStartingCastle() {
      for(var i = 0; i < this.startingCastles.length; i++){
         if(this.nodes[this.startingCastles[i]].army.player == null){
            return this.nodes[this.startingCastles[i]];
         }
      }
      return null;
   }

   readMap(mapName){
      const fs = require("fs");
      var buffer = JSON.parse(fs.readFileSync("./maps/"+mapName+".txt", "utf-8"));
      console.log(buffer);
      this.castles = buffer.castles;
      this.startingCastles = buffer.startingCastles;
      console.log(this.startingCastles)
      let nodeFactory = new MapNodeFactory();
      var type = "Intersection";
      for(var i=0; i<buffer.nodes.length; i++){
         var tNode = buffer.nodes[i];
         if(this.castles.indexOf(i) == -1){
            type = "Intersection";
         }else{
            type = "Castle";
         }
         this.nodes[i] = nodeFactory.getNode(type, tNode.x, tNode.y, tNode.adj, i);
      }
   }

   nodeToXY(moveNodes) {
      var swipePath = new Array();
      // converts the moveNodes list from nodeIds to x and y variables
      for(var i = 0; i < moveNodes.length; i++) {
         swipePath.push({x:this.nodes[moveNodes[i]].x, y:this.nodes[moveNodes[i]].y});
      }
      return swipePath;
   }
}
class MapNodeFactory{
   getNode(type, x, y, adj, id){
      if(type == "Castle"){
         return new Castle(x, y, adj, id);
      }else if(type == "Intersection"){
         return new Intersection(x, y, adj, id)
      }
   }
}
class MapNode extends locationClass.Location{
   constructor(x,y,adj,id){
      // Conversion from 100 pixel interval to 48 pixel interval
      super((x / 100) * 48, (y / 100) * 48);
      this.id = id;
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

class Intersection extends MapNode{
   //move intersection specific code here here
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
   MapFactory:MapFactory,
   MapNode:MapNode,
   Castle:Castle,
   Map:Map
};
