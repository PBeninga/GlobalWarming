var gameObject = require("../Game.js");
var app = require("../app.js");

class io {
   constructor() {}
   of(id) {return new socket()}
}

class socket {
   constructor() {}
   emit(data) {}
}

describe("Test adding a new player", function(){
   game = new gameObject.Game(null,new io());

   it("adding player",function(){
      //console.log("Adding player 0, should return true");
      expect(game.addPlayer(675)).toBe(true);
   
//      print("Attempting to add player 0 again, should return false");
      expect(game.addPlayer(675)).toBe(false);

      //console.log("filling players");
      for(var i = 1; i < game.map.startingCastles.length;i++){
         game.addPlayer(i);
      }
   
      //console.log("Attempting to add a player to a full thing");
      expect(game.addPlayer(123413241324)).toBe(false);
   });
});

describe("Test increment all troops:",function(){
   game = new gameObject.Game(null,new io());
   game.addPlayer(69);
   game.addPlayer(420);

   player = game.playerPool.getPlayer(69);
   last = player.armies[0].count;

   it("test that all troops are incremented the same way",function(){ 
      playerA = game.playerPool.getPlayer(69);
      lastA = player.armies[0].count;    
      playerB = game.playerPool.getPlayer(420);
      lastB = player.armies[0].count;
      expect(lastA == lastB);
   });

   game.incrementTroops(10);
   it("test that troops increment",function(){
      expect(last + 10 == player.armies[0].count);
   });
});
/*
describe("Test removing players", function(){

   game = new gameObject.Game(null,new io());

   game.addPlayer(20);

   it("test player lookup and remove", function(){
   
      console.log("doing player lookup, should be at index 0");
      expect(game.playerPool.getPlayer(20).id == 20);

      console.log("removing player");
      game.playerPool.removePlayer(20);
   
      console.log("looking up removed player"); 
      expect(game.playerPool.getPlayer(20) == null);
   });

});*/
