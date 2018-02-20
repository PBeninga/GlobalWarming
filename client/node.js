class MapNode {
  constructor(node_id, x, y, auxNodes) {
    this.id = node_id;
    this.x = x;
    this.y = y;
    this.army = null;
    this.adj = auxNodes;
    this.graphics = null;
  }

  display(game) {
    this.graphics = game.add.sprite(this.x, this.y, 'node_img');
    this.graphics.scale.x = 0.1;
    this.graphics.scale.y = 0.1;
    this.graphics.anchor.setTo(0.5,0.5);
    this.graphics.height = 50;
    this.graphics.width = 50;
/*
    this.graphics.inputEnabled = true;
    this.graphics.events.onInputDown.add(console.log("clicked"), this);
*/
  }

  update() {

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
