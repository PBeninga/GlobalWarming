var gameObject = require("../objects.js");
var app = require("../app.js");

describe("Test adding a new player", function(){
   game = new gameObject.Game(null,0);
   app.makeMap(game);

   it("returns true because there are empty castles",function(){
      expect(game.addPlayer(0)).toBe(true);
   });

   it("returns false because this player is in game already",function(){
      expect(game.addPlayer(0)).toBe(false);
   });

   for(var i = 1; i < game.map.startingCastles.length;i++){
      game.addPlayer(i);
   }

   it("returns false because I am filling up the map before adding a player", function(){
      expect(game.addPlayer(123413241324)).toBe(false);
   });
});
