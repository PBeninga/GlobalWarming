//Produces a sound object from audio file
function getSound(file,volume,loop) {		
		var tempSound = document.createElement("audio");
		tempSound.setAttribute("src", file);
		tempSound.volume = volume;
		tempSound.loop = loop;
                return tempSound;
}

//Changes the volume of each audio object(audio[0])
//based off ratio given in audio[1]
//Audios is initialized in PreLoader
function changeVolume(audios, vol){
   boop.play();
   for(audio of audios) {
      audio[0].volume = audio[1] * vol;
   }
}

//Loops through volume and updates button text to new volume 
var master_vol = .5;
function volumeUpdate(){
   if(master_vol > .9){
      master_vol=0;
   }else{
      master_vol+= .1;
   }
   master_vol = Math.round(master_vol*10)/10;
   changeVolume(sounds,master_vol);
   volumeButton.text.text = master_vol
   boop.play();
}

//Produces a simple sprite based off given unit index
function makeUnit(unit, x, y, scale_x, scale_y){
   temp = game.add.sprite(x,y,'armies');
   temp.animations.add('walk',[unit,unit+1,unit+2],true);
   temp.anchor.setTo(.5,.5);
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

function getInputField(name,type,x,y){
   var width = canvas_width*3/5;
   inputData = {
      font: '18px Arial',
      fill: '#212121',
      fontWeight: 'bold',
      width: width,
      padding: 8,
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 6,
      placeHolder: name,
      type: type
   };
   return game.add.inputField(x-width/2, y, inputData);
}
