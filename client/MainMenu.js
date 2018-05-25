var socket;
var playerID;
var playerSocket;
var menuFlag;
var titleText;
var startButton;
var loginButton;
var createAccountButton;
var MainMenu = function(game){};
var username;

function initializeValues() {
   username = 'guest';
   playerID = createID();
   menuFlag = 0;
}

function createBaseButtons() {
  startButton = createButton(game, "Game Start", 'button1', canvas_width*3/8, canvas_height/2 - 100, 1, MainMenu, function() {
    boop.play();
    game.state.start('Main', true, false, [socket,username]);
  });
  chooseUnitButton = createButton(game, "Change Avatar", 'button1', canvas_width/2+ 100, canvas_height/2 + 100, 1, MainMenu, nextUnit);
}

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
   army = makeUnit(unit,canvas_width/2,canvas_height/2-100,10,10);
}

function createID() {
   return Math.random().toString(36).substr(2, 10);
}

MainMenu.prototype = {
 create: function(game) {
    initializeValues();
    socket = io.connect();
    game.add.plugin(PhaserInput.Plugin);
    console.log("Reached main menu");
    game.stage.backgroundColor = 0xADD8E6;
    titleText = game.add.bitmapText((canvas_width/2) - 255, 100, 'carrier_command', 'Global Warming', 32);

    createBaseButtons();
    nextUnit();
    menu_music.play();
    
    // start game
  }
}
