var gameObject = require("../objects.js");
var app = require("../app.js");

describe("Test adding a new player", function(){
   it("returns false because there is no map",function(){
      game = new gameObject.Game(null,0);
      app.makeMap(game);
      game.map = new Map();
      expect(game.addPlayer(0)).toBe(false);
   });
});
