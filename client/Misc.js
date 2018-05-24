function getSound(sound,volume,loop) {		
		var tempSound = document.createElement("audio");
		tempSound.setAttribute("src", sound);
		tempSound.volume = volume;
		tempSound.loop = loop;
                return tempSound;
}

function makeUnit(unit, x, y, scale_x, scale_y){
   temp = game.add.sprite(x,y,'armies');
   temp.animations.add('walk',[unit,unit+1,unit+2],true);
   temp.scale.setTo(scale_x, scale_y);
   temp.animations.play('walk',3,true);
   return temp;
}

function createButton(game, string, ident, x, y, scale, state, callback, anchor = .5) {
  var tempButton = game.add.button(x, y, ident, callback, state, 2, 1, 0);
  tempButton.scale.set(scale,scale);
  tempButton.anchor.setTo(anchor, anchor);
  tempButton.text = game.add.text(tempButton.x, tempButton.y, string, {
    font: "14px Arial",
    fill: "#fff",
    align: "center"
  });
  tempButton.text.anchor.setTo(0.5, 0.5);

  return tempButton;
}
