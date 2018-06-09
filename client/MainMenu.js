var MainMenu = function(game){};

//Displays the unit that the player will use.
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
   var unit = units[chosenUnit];
   army = makeUnit(unit,canvas_width/2,canvas_height/2+100,10,10);
}


//Lets add in some user stats!

MainMenu.prototype = {
   create: function(game) {
      if(!socket){
         socket = io.connect();
      }
      game.add.plugin(PhaserInput.Plugin);
      console.log("Reached main menu");
      game.stage.backgroundColor = 0xADD8E6;

      game.add.sprite(canvas_width/2 - 325,canvas_height/2-250,'title').scale.setTo(.15,.15); 
      var titleText = game.add.bitmapText((canvas_width/2) - 250, canvas_height/2-100, 'carrier_command', ' Battle Royale', 28);
      
      var startButton = createButton(game, "Game Start", 'button1', canvas_width/2, canvas_height/2, 1, MainMenu, function() {
         boop.play();
         game.state.start('Main', true, false, socket);
      });
      
      var chooseUnitButton = createButton(game, "Change Avatar", 'button1', canvas_width/2, canvas_height/2 + 210, 1, MainMenu, nextUnit);

      var volumeButton = createButton(game, '0.5', 'tiny_button', 100, canvas_height-100, 1, MainMenu, volumeUpdate);
      //initializes chosen unit graphic
      nextUnit();

      menu_music.play(); 
   }
}
