var game = require("../Game.js")
var app = require("../app.js")

describe("Find game by id", function() {
   it("should create a new game because none exists", function() {
      game = app.findGame("12345")
      expect(app.games.get(game.roomid)).not.toBe(null)
      app.removeGame(game.roomid)
   });

   it("should have a player in a game", function() {
      game = app.findGame("12345")
      player = game.playerPool.getPlayer("12345")
      expect(player.id).toBe("12345")
      app.removeGame(game.roomid)
   });
});
