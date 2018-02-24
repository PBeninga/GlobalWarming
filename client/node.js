class MapNode {
  constructor(node_id, x, y) {
    this.id = node_id;
    this.x = x;
    this.y = y;
    this.paths = [];

    this.graphics = game.add.sprite(node_data.x, node_data.y, 'node_img');
    this.graphics.anchor.setTo(0.5,0.5);
    this.graphics.height = 50;
    this.graphics.width = 50;
  }

  display() {
  }

  update() {
  }

  addPath(endNode) {
    let newPath = new Path(this, endNode);
    newPath.display();
    this.paths.push(newPath);
  }

  pathTo(node) {
    for(var i = 0; i < this.paths.length; i++) {
      if(this.paths[i].end.id == node.id) {
        return true;
      }
    }
    return false;
  }
}
