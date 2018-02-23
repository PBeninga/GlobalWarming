function merge(army1, army2) {
  if(army1.owner == army2.owner && army1.node.id == army2.node.id) {
    let newArmy = new Army(army1.count + army2.count, army1.owner, army1.node);
    army2.destroyGraphics();
    newArmy.graphics = army1.graphics;
    newArmy.update();
    return newArmy;
  }
  return null;
}

class Army {
  constructor(count, owner, node) {
    this.count = count;
    this.owner = owner;
    this.color = owner.color;
    this.node = node;
    this.graphics = null;
  }

  display(game) {
    this.graphics = game.add.graphics();
    this.graphics.beginFill(this.color, 0.5);
    this.graphics.drawCircle(this.node.x, this.node.y, 25);
    this.graphics.anchor.setTo(0.5,0.5);
    this.graphics.endFill();
  }

  destroyGraphics() {
    if(this.graphics != null) {
      this.graphics.destroy();
    }
  }

  update() {
    this.destroyGraphics();
    this.graphics = game.add.graphics();
    this.graphics.beginFill(this.color, 0.5);
    this.graphics.drawCircle(this.node.x, this.node.y, 25);
    this.graphics.anchor.setTo(0.5,0.5);
    this.graphics.endFill();
  }
}
