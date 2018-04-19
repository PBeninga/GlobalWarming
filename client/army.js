class Army {
  constructor(count, owner, x, y) {
    this.count = count;
    this.owner = owner;
    this.id = -1;
    this.color = owner.color;
    this.x = x;
    this.y = y;
    this.sprite = game.add.sprite(x, y, 'armies');
    var unit = 6;
    this.right = this.sprite.animations.add('right',[unit,unit +1 , unit +2],1);
    this.down = this.sprite.animations.add('down',[unit + 36,unit + 37,unit + 38],1);
    this.up = this.sprite.animations.add('up',[unit + 72,unit + 73,unit + 74],1);
    this.standing = this.sprite.animations.add('standing',[unit+36],1);
    this.castle = this.sprite.animations.add('castle',[30],1);
    this.sprite.anchor.setTo(0.5,0.5);
    this.sprite.scale.setTo(1.75,1.75);


    this.graphics = game.add.graphics(x,y);
    this.graphics.beginFill(this.color, 0.5);
    this.graphics.drawCircle(0, 0, 45);
    this.graphics.anchor.setTo(0.5,0.5);
    this.graphics.endFill();
    
    this.countGraphics = game.add.text(this.x, this.y, this.count, {
      font: "14px Arial",
      fill: this.color,
      align: "center"
    });
    this.countGraphics.anchor.setTo(.5, .5);
  }

  // Destroys all graphics associated with this object
  destroyGraphics() {
    if(this.sprite != null) {
      this.sprite.destroy();
    }
    if(this.countGraphics != null) {
      this.countGraphics.destroy();
    }
    if(this.graphics != null){
       this.graphics.destroy();
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

  moveTo(x, y,clientNode) {
    if(x > this.x && y == this.y && this.sprite.animations.currentAnim != 'right'){
       this.sprite.scale.x = 1.75;
       this.sprite.animations.play('right', 30, true);
    }
    if(x == this.x && y < this.y && this.sprite.animations.currentAnim != 'up'){
       this.sprite.animations.play('up', 30, true);
    }
    if(x == this.x && y > this.yi && this.sprite.animations.currentAnim != 'down'){
       this.sprite.animations.play('down', 30, true);
    }
    if(x < this.x && y == this.y && this.sprite.animations.currentAnim != 'right'){
       this.sprite.scale.x = -1.75;
       this.sprite.animations.play('right', 30, true);
    }
    if(clientNode != null){
       if(clientNode.castle){
         this.sprite.animations.play('castle',1,false);
       }else{
         this.sprite.animations.play('standing',1,false);
       }
    }
    this.sprite.x = x;
    this.sprite.y = y
    this.countGraphics.x = x;
    this.countGraphics.y = y;
    this.graphics.x = x;
    this.graphics.y = y;
    this.x = x;
    this.y = y;
  }
}
