var web_app = require("../../app.js");
var game = require("../../Game.js");
var playerObject = require('../../Player.js');

describe('unit tests', function(){

   it("Testing app and game", function(){
      
      // TEST 1 app.js for adding games
      expect( web_app.games.size == 0 ).toBe(true);
      var game1 = web_app.findGame(000);
      expect( web_app.games.size == 1 ).toBe(true);
      var game2 = web_app.findGame(001); // Should return game 1
      expect( web_app.games.size == 1 ).toBe(true);
      expect( game1 == game2 ).toBe(true);
      
      // TEST 2 Player.js for checking active player
      expect( game1.playerPool.containsActive(000) ).toBe(true);


      // TEST 3 Game.js  Ensure the correct State
      expect( game1.gameState == 0  ).toBe(true);
      
      
      // TEST 4 Game.js Ensure we can start the game
      game1.tick();
      expect( game1.gameState == 1  ).toBe(true);
      
      
      // TEST 5  Game.js for removing player
      game1.removePlayer(000);
      expect( game1.playerPool.containsActive(000) ).toBe(false);
      
      
      // TEST 6 app.js removing a game
      game1.removeGame(game1.roomid);
      expect( web_app.games.size == 0 ).toBe(true); 
      
   });

 });
