class Army {
  constructor(count, owner, x, y) {
    this.count = count;
    this.owner = owner;
    this.id = -1;
    //this.color = owner.color;
    if(owner.color ==3){
       this.color = "0x0000FF";
    }else{
      this.color = "0xFF0000";
    }
    this.x = x;
    this.y = y;
    this.sprite = game.add.sprite(x, y, 'armies');
    this.unit = owner.color;
    // selected units are 3,6,12,15,18,21,432,435,438,441,444,447,450,453,456,459,462,465, 756,762,765,771,774,780
    this.right = this.sprite.animations.add('right',[this.unit,this.unit +1 , this.unit +2],1);
    this.down = this.sprite.animations.add('down',[this.unit + 36,this.unit + 37,this.unit + 38],1);
    this.up = this.sprite.animations.add('up',[this.unit + 72,this.unit + 73,this.unit + 74],1);
    this.standing = this.sprite.animations.add('standing',[this.unit+36],1);
    this.castle = this.sprite.animations.add('castle',[30],1);
    this.sprite.anchor.setTo(0.5,0.5);
    this.sprite.scale.setTo(1.75,1.75);


    this.graphics = game.add.graphics(x,y);
    this.graphics.beginFill(this.color, 0.5);
    this.graphics.drawCircle(0, 15, 32);
    this.graphics.anchor.setTo(0.5,0.5);
    this.graphics.endFill();
    this.countGraphics = game.add.text(this.x, this.y, this.count, {
      font: "14px Arial",
      fill: this.color,
      align: "right"
    });
    this.countGraphics.anchor.setTo(1.5, 1.5);
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
    this.countGraphics.setText(Math.ceil(this.count));
    this.countGraphics.addColor(this.color, 0);
    this.countGraphics.addFontStyle(font, 0);
  }

  moveTo(x, y,clientNode) {
    if(x > this.x && y == this.y && this.sprite.animations.currentAnim != 'right'){
       this.sprite.scale.x = 1.75;
       this.sprite.animations.play('right', 3, true);
    }
    if(x == this.x && y < this.y && this.sprite.animations.currentAnim != 'up'){
       this.sprite.animations.play('up', 3, true);
    }
    if(x == this.x && y > this.y && this.sprite.animations.currentAnim != 'down'){
       this.sprite.animations.play('down', 3, true);
    }
    if(x < this.x && y == this.y && this.sprite.animations.currentAnim != 'right'){
       this.sprite.scale.x = -1.75;
       this.sprite.animations.play('right', 3, true);
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
