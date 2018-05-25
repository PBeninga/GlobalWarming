var MainMenu = function(game){};

var army;
var chosenUnit = 0;
function nextUnit(){
   boop.play();
   if(army){
      army.destroy()
   }
   chosenUnit += 1;
   if(chosenUnit >= units.length){
      chosenUnit = 0;
   }
   unit = units[chosenUnit];
   army = makeUnit(unit,canvas_width/2,canvas_height/2,10,10);
}

var i = .5;
function volumeUpdate(){
   console.log(i);
   if(i > .9){
      i=0;
   }else{
      i+= .1;
   }
   i = Math.round(i*10)/10;
   changeVolume(sounds,i);
   volumeButton.text.text = i;
   boop.play();
}
//Lets add in some volume controls!
//Lets add in some user stats!

MainMenu.prototype = {
   create: function(game) {
      initializeValues();
      game.add.plugin(PhaserInput.Plugin);
      console.log("Reached main menu");
      game.stage.backgroundColor = 0xADD8E6;
      titleText = game.add.bitmapText((canvas_width/2) - 255, 100, 'carrier_command', 'Global Warming', 32);
      startButton = createButton(game, "Game Start", 'button1', canvas_width/2, canvas_height/2 - 100, 1, MainMenu, function() {
         boop.play();
         game.state.start('Main', true, false, [socket,username]);
      });
      chooseUnitButton = createButton(game, "Change Avatar", 'button1', canvas_width/2, canvas_height/2 + 110, 1, MainMenu, nextUnit);
      volumeButton = createButton(game, i, 'button1', canvas_width/2, canvas_height/2 + 200, 1, MainMenu, volumeUpdate);
      nextUnit();
      menu_music.play(); 
   }
}