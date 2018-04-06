var gameObject = require("../objects.js");
var app = require("../app.js");

describe("Test adding a new player", function(){
   it("returns true because there are empty castles",function(){
      game = new gameObject.Game(null,0);
      app.makeMap(game);
      expect(game.addPlayer(0)).toBe(true);
   });
});
