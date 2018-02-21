class MapNode {
  constructor(node_id, x, y, auxNodes) {
    this.id = node_id;
    this.x = x;
    this.y = y;
    this.army = null;
    this.adj = auxNodes;
    this.owned = false;
    this.graphics = null;
  }

  display(game) {
    this.graphics = game.add.sprite(this.x, this.y, 'node_img');
    this.graphics.scale.x = 0.1;
    this.graphics.scale.y = 0.1;
    this.graphics.anchor.setTo(0.5,0.5);
    this.graphics.height = 50;
    this.graphics.width = 50;
    this.graphics.inputEnabled = true;
    this.graphics.events.onInputDown.add(function(){console.log("clicked");this.update()}, this);
    let string = this.army ? this.army.count : 0;
    var text = game.add.text(this.graphics.x, this.graphics.y, string, {
      font: "14px Arial",
      fill: "#000",
      align: "center"
    });
    text.anchor.setTo(0.5, 0.5);
  }

  update() {
    this.graphics.destroy();
    this.graphics = game.add.sprite(this.x, this.y, 'node_img');
    this.graphics.scale.x = 0.1;
    this.graphics.scale.y = 0.1;
    this.graphics.anchor.setTo(0.5,0.5);
    this.graphics.height = 50;
    this.graphics.width = 50;
    this.graphics.inputEnabled = true;
    this.graphics.events.onInputDown.add(function(){console.log("clicked" +" "+this.owned);this.update()}, this);
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

  attack(other_node) {
    if(this.armies <= 1 || this.adj.indexOf(other_node) < 0) {
      return null;
    }

    let sendArmies = new Army(this.army.count / 2, this.army.owner, this.id);
    this.army.count -= sendArmies.count;

    var attack_data = {
      army: sendArmies,
      nodes: [this, other_node],
    }

    return attack_data;
  }
}
