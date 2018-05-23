class Battle{
   constructor(x,y){
      this.x = x;
      this.y = y;
      this.sprite = game.add.sprite(x,y,'battle');
      this.sprite.animations.add('fight',[0,1]);
      this.sprite.animations.play('fight',2,true);
   }

   end(){
      this.sprite.destroy();
   }
}
