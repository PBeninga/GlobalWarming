class Battle{
   constructor(battle){
      this.x = battle.x;
      this.y = battle.y;
      this.sprite = game.add.sprite(this.x,this.y,'battle');
      this.sprite.anchor.setTo(0.5,0.5);
      this.sprite.scale.setTo(.5,.5);
      this.sprite.animations.add('fight',null,2,true);
      this.sprite.animations.play('fight');
      for(var i = 0; i < battle.players.length; i++) {
         if(ClientPlayer.id == battle.players[i].id) {
            battle_sound.play();
         }
      }
   }

   end(){
      this.sprite.destroy();
   }
}
