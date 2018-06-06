var web_app = require("../../app.js");
var game = require("../../Game.js");
var playerObject = require('../../Player.js');

describe('unit tests', function(){

   it("Testing app and game", function(){
      
      // TEST 1 ensure that games are added correctly
      expect( web_app.games.size == 0 ).toBe(true);
      var game1 = web_app.findGame(000);
      expect( web_app.games.size == 1 ).toBe(true);
      var game2 = web_app.findGame(001); // Should return game 1
      expect( web_app.games.size == 1 ).toBe(true);
      expect( game1 == game2 ).toBe(true);
      
      // TEST 2 ensure that 


      // TEST 2 ensure that games are removed correctly
      game1.removePlayer(000);
      
      
   });

 });
