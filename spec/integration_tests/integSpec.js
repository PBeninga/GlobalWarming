var game = require("../../Game.js")
var app = require("../app.js")

describe("Find game by id", function() {
   //app.games = new Map()

   it("should create a new game because none exists", function() {
      game = app.findGame("12345")
      expect(app.games.get(game.roomid)).not.toBe(null)
      app.games.delete(game.roomid)
   });
   it("should find an already made game", function() {
      foundGame = app.findGame("12345");
      expect(foundGame.roomid).toBe(foundGame.roomid)
      app.games.delete(game.roomid)
   });

   it("should have a player in a game", function() {
      game = app.findGame("12345")
      player = game.playerPool.activePlayers[1]
      expect(player.id).toBe("12345")
      app.games.delete(game.roomid)
   }); 
});
