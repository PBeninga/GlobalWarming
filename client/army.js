class Army {
  constructor(count, owner, x, y) {
    this.count = count;
    this.owner = owner;
    this.id = -1;
    this.color = owner.color;
    this.x = x;
    this.y = y;
    this.graphics = game.add.sprite(x, y, 'army');
    this.walk = this.graphics.animations.add('walk',[3,4,5],1);

    this.graphics.animations.play('walk', 30, true);
    this.graphics.anchor.setTo(0.5,0.5);

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
    var font  = "14px Arial";
    if(ClientPlayer.id == this.owner.id){
      font  = "20px Arial";
    }
    this.countGraphics.setText(this.count);
    this.countGraphics.addColor(this.color, 0);
    this.countGraphics.addFontStyle(font, 0);
  }

  moveTo(x, y) {
    this.graphics.x = x;
    this.countGraphics.x = x;
    this.graphics.y = y;
    this.countGraphics.y = y;
    this.x = x;
    this.y = y;
  }
}
