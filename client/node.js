class MapNode {
  constructor(node_id, x, y, adj, graphics) {
    this.id = node_id;
    this.x = x;
    this.y = y;
    this.army = null;
    this.adj = adj;
    this.owned = false;
    this.graphics = graphics;
    this.graphics.scale.x = 0.1;
    this.graphics.scale.y = 0.1;
    this.graphics.anchor.setTo(0.5,0.5);
    this.graphics.height = 50;
    this.graphics.width = 50;
  }

  display(game) {
    let string = this.army ? this.army.count : 0;
    var text = game.add.text(this.graphics.x, this.graphics.y, string, {
      font: "14px Arial",
      fill: "#000",
      align: "center"
    });
    text.anchor.setTo(0.5, 0.5);
  }

  update() {
    let string = this.army ? this.army.count : 0;
    if(!this.owned){
      var text = game.add.text(this.graphics.x, this.graphics.y, string, {
        font: "14px Arial",
        fill: "#000",
        align: "center"
      });
    }else{
      var text = game.add.text(this.graphics.x, this.graphics.y, string, {
        font: "14px Arial",
        fill: "#F00",
        align: "center"
      });
    }
    text.anchor.setTo(0.5, 0.5);
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
