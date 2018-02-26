function merge(army1, army2) {
  if(army1.owner == army2.owner) {
    let newArmy = new Army(army1.count + army2.count, army1.owner, army1.node);
    newArmy.graphics = army1.graphics;
    army2.destroyGraphics();
    newArmy.display();
    return newArmy;
  }
  return null;
}

class Army {
  // TODO: Eventually replace Node with a Location object
  constructor(count, owner, node) {
    this.count = count;
    this.owner = owner;
    this.id = -1;
    this.color = owner.color;
    this.node = node;
    this.x = node.x;
    this.y = node.y;

    this.graphics = game.add.graphics(this.x, this.y);
    this.graphics.beginFill(this.color, 0.5);
    this.graphics.drawCircle(0, 0, 25);
    this.graphics.anchor.setTo(0.5,0.5);
    this.graphics.endFill();
    this.graphics.inputEnabled = true;

    this.countGraphics = null;
  }

  display() {
    this.countGraphics = game.add.text(this.x, this.y, this.count, {
      font: "14px Arial",
      fill: this.color,
      align: "center"
    });
    this.countGraphics.anchor.setTo(0.5, 0.5);
  }

  // Destroys all graphics associated with this object
  destroyGraphics() {
    if(this.graphics != null) {
      this.graphics.destroy();
    }
    if(this.countGraphics != null) {
      this.countGraphics.destroy();
    }
  }

  update() {
    this.countGraphics.destroy();
    this.countGraphics = game.add.text(this.x, this.y, this.count, {
      font: "14px Arial",
      fill: this.color,
      align: "center"
    });
    this.countGraphics.anchor.setTo(0.5, 0.5);
  }
}
