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
   army = makeUnit(unit,canvas_width/2+200,canvas_height/2+100,10,10);
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
      
      var startButton = createButton(game, "Join Game", 'button1', canvas_width/2 + 200, canvas_height/2 - 10, 1, MainMenu, function() {
         boop.play();
         game.state.start('Main', true, false, socket);
      });
      
      var chooseUnitButton = createButton(game, "Change Avatar", 'button1', canvas_width/2 + 200, canvas_height/2 + 210, 1, MainMenu, nextUnit);

      volumeButton = createButton(game, null, 'medium', 25, 25, .05, MainMenu, volumeUpdate);
      for(var i = 0; i < 4; i++){
         volumeUpdate();
      }

      game.add.text(200,350,'Defeat all enemies!\nCommand your troops by clicking\nand dragging between castles.\nWatch out for the storm!\n Troops in the storm take damage.',{
		font: "32px Arial",
		fill: "#FFFFFF",
		align: "center"
      });

      //initializes chosen unit graphic
      nextUnit();

      menu_music.play(); 
   }
}
