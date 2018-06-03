var socket;
var username;

var MatchMaking = function(game){};

//Lets add in some user stats!

MatchMaking.prototype = {
   create: function(game) {
      console.log("REACHED");

      if(!socket){
         socket = io.connect();
      }
      game.stage.backgroundColor = 0xADD8E6;
      titleText = game.add.bitmapText((canvas_width/2) - 90, 100, 'carrier_command', 'Lobby', 32);

      startButton = createButton(game, "Game Start", 'button1', canvas_width/2, canvas_height/2 - 100, 1, MatchMaking, function() {
         boop.play();
         game.state.start('Main', true, false, [socket,username]);
      });
   },

   init: function(sock) {
      socket = sock[0];
      username = sock[1];
      console.log("REACHED");
   }
}
