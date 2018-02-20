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
    this.graphics = game.add.graphics(this.x, this.y);
    this.graphics.radius = 20;

    this.graphics.beginFill(0x000000);
    this.graphics.lineStyle(2, 0x000000, 1);
    this.graphics.drawCircle(0, 0, this.graphics.radius * 2);
    this.graphics.endFill();
    this.graphics.anchor.setTo(0.5,0.5);
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
