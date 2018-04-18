class Army {
  constructor(count, owner, x, y) {
    this.count = count;
    this.owner = owner;
    this.id = -1;
    this.color = owner.color;
    this.x = x;
    this.y = y;
 //   this.circle = game.add.graphics(x,y);
    this.graphics = game.add.sprite(x, y, 'armies');
    var unit = 3;
    this.right = this.graphics.animations.add('right',[unit,unit +1 , unit +2],1);
    this.down = this.graphics.animations.add('down',[unit + 36,unit + 37,unit + 38],1);
    this.down = this.graphics.animations.add('up',[unit + 72,unit + 73,unit + 74],1);
    this.down = this.graphics.animations.add('hidden',[30],1);

/*    this.circle.beginFill(this.color, 0.5);
    this.circle.drawCircle(0, 0, 45);
    this.circle.anchor.setTo(0.5,0.5);
    this.circle.endFill();
*/
    this.graphics.anchor.setTo(0.5,0.5);
    this.graphics.scale.setTo(1.5,1.5);

    this.countGraphics = game.add.text(this.x, this.y, this.count, {
      font: "14px Arial",
      fill: this.color,
      align: "center"
    });
    this.countGraphics.anchor.setTo(.5, .5);
  }

  // Destroys all graphics associated with this object
  destroyGraphics() {
    if(this.graphics != null) {
      this.graphics.destroy();
    }
    if(this.countGraphics != null) {
      this.countGraphics.destroy();
    }
 //   if(this.circle != null_{
 //      this.circle.destroy();
 //   }
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

  moveTo(x, y,clientNode) {
    if(x > this.x && y == this.y){
       this.graphics.scale.x = 1;
       this.graphics.animations.play('right', 30, true);
    }
    if(x == this.x && y < this.y){
       this.graphics.animations.play('up', 30, true);
    }
    if(x == this.x && y > this.y){
       this.graphics.animations.play('down', 30, true);
    }
    if(x < this.x && y == this.y){
       this.graphics.scale.x = -1;
       this.graphics.animations.play('right', 30, true);
    }
    if(clientNode != null){
       this.graphics.animations.play('hidden',1,false);
    }
    this.graphics.x = x;
    this.countGraphics.x = x;
    this.graphics.y = y;
    this.countGraphics.y = y;
//    this.circle.x = x;
//    this.circle.y = y;
    this.x = x;
    this.y = y;
  }
}
