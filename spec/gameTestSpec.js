var gameObject = require("../objects.js");
var app = require("../app.js");

describe("Test adding a new player", function(){
   game = new gameObject.Game(null,0);
   app.makeMap(game);

   it("adding player",function(){
      //console.log("Adding player 0, should return true");
      expect(game.addPlayer(0)).toBe(true);
      
//      print("Attempting to add player 0 again, should return false");
 //     expect(game.addPlayer(0)).toBe(false);

      //console.log("filling players");
      for(var i = 1; i < game.map.startingCastles.length;i++){
         game.addPlayer(i);
      }
      
      //console.log("Attempting to add a player to a full thing");
      expect(game.addPlayer(123413241324)).toBe(false);
   });
});

describe("Test increment all troops:",function(){
   game = new gameObject.Game(null,0);
   app.makeMap(game);
   game.addPlayer(69);
   game.addPlayer(420);

   player = game.findPlayerById(69);
   last = player.armies[0].count;

   it("test that all troops are incremented the same way",function(){ 
      playerA = game.findPlayerById(69);
      lastA = player.armies[0].count;    
      playerB = game.findPlayerById(420);
      lastB = player.armies[0].count;
      expect(lastA == lastB);
   });

   game.incrementTroops(10);
   it("test that troops increment",function(){
      expect(last + 10 == player.armies[0].count);
   });
});

describe("Test removing players", function(){
   
   game = new gameObject.Game(null,0);
   app.makeMap(game);
   
   game.addPlayer(0);
  
   it("test player lookup and remove", function(){
      
      console.log("doing player lookup, should be at index 0");
      expect(game.findPlayerIndexById(0) == 0 );
  
      console.log("removing player");
      game.removePlayer(0);
      
      console.log("looking up removed player"); 
      expect(game.findPlayerIndexById(0) == -1 );
   });

});
