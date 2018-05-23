class Battle{
   constructor(x,y){
      this.x = x;
      this.y = y;
      this.sprite = game.add.sprite(x,y,'battle'); 
      this.sprite.anchor.setTo(0.5,0.5);
      this.sprite.scale.setTo(.5,.5);
      this.sprite.animations.add('fight',null,2,true);
      this.sprite.animations.play('fight');
   }

   end(){
      this.sprite.destroy();
   }
}
