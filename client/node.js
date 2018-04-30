class MapNode {
  constructor(node_id, x, y,castle) {
    this.id = node_id;
    this.x = x;
    this.y = y;
    this.castle = castle;
    this.paths = [];
    if(castle){
      this.graphics = game.add.image(x, y, 'castle_img');
    }else{
      this.graphics = game.add.image(x, y, 'node_img');
    }
    this.graphics.anchor.setTo(0.5,0.5);
    this.graphics.height = 35;
    this.graphics.width = 35;
    //this.graphics.scale.setTo(0.5, 0.5);
  }

  display() {
  }

  update() {
  }

  // Adds a path from this node to the endNode, and displays it.
  addPath(endNode) {
    let newPath = new Path(this, endNode);
    newPath.display();
    this.paths.push(newPath);
    return newPath;
  }

  // Checks for a path between this node and the node parameter
  pathTo(node) {
    for(var i = 0; i < this.paths.length; i++) {
      if(this.paths[i].end.id == node.id) {
        return this.paths[i];
      }
    }
    return null;
  }
}
