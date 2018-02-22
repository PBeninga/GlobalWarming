class MapNode {
  constructor(node_id, x, y, graphics) {
    this.id = node_id;
    this.x = x;
    this.y = y;
    this.army = null;
    this.paths = [];
    this.owner = null;

    this.graphics = graphics;
    this.graphics.text = null;
    this.graphics.scale.x = 0.1;
    this.graphics.scale.y = 0.1;
    this.graphics.anchor.setTo(0.5,0.5);
    this.graphics.height = 50;
    this.graphics.width = 50;
  }

  display(game) {
    let string = this.army ? this.army.count : 0;
    if(this.owner != null) {
      this.graphics.text = game.add.text(this.graphics.x, this.graphics.y, string, {
        font: "14px Arial",
        fill: this.owner.color,
        align: "center"
      });
    } else {
      this.graphics.text = game.add.text(this.graphics.x, this.graphics.y, string, {
        font: "14px Arial",
        fill: "#000000",
        align: "center"
      });
    }
    this.graphics.text.anchor.setTo(0.5, 0.5);
  }

  update() {
    this.graphics.text.destroy();
    let string = this.army ? this.army.count : 0;
    if(this.owner != null) {
      this.graphics.text = game.add.text(this.graphics.x, this.graphics.y, string, {
        font: "14px Arial",
        fill: this.owner.color,
        align: "center"
      });
    } else {
      this.graphics.text = game.add.text(this.graphics.x, this.graphics.y, string, {
        font: "14px Arial",
        fill: "#000000",
        align: "center"
      });
    }
    this.graphics.text.anchor.setTo(0.5, 0.5);
  }

  addPath(path) {
    if(path.start.id == this.id) {
      this.paths.push(path);
    }
  }

  pathTo(node) {
    for(var i = 0; i < this.paths.length; i++) {
      if(this.paths[i].end.id == node.id) {
        return true;
      }
    }
    return false;
  }

  updateArmy(army) {
    this.army = army;
  }

  newArmy(new_army) {
    if(this.army == null) {
      this.army = new_army;
      return;
    }

    new_army.node_id = this.node_id;
    if(this.army.player_id = new_army.player_id) {
      this.army = merge(this.army, new_army);
    }
  }
}
