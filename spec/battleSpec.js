var armys = require("../Army.js");
var battles = require("../Battle.js");
var player = require("../Player.js");


describe('Test battles', function(){

   it("Checking that battle ends", function(){
      dummy = new player.Player('ya','ya'); 
      armya = new armys.Army(dummy,100,null,null,null,null);
      armyb = new armys.Army(dummy,1,null,null,null,null);

      battle = new battles.Battle(armya,dummy,null,armyb,dummy,null,null,null,null);
      expect(battle.tick()).toBe(false);
      //battle should end because one army has 100 while the other has 1;
   });

   it("Checking that battle does not end off the bat", function(){
      dummy = new player.Player('ya','ya'); 
      armya = new armys.Army(dummy,100,null,null,null,null);
      armyb = new armys.Army(dummy,100,null,null,null,null);

      battle = new battles.Battle(armya,dummy,null,armyb,dummy,null,null,null,null);
      expect(battle.tick()).toBe(true);
      //Shouldn't end because these are large armies, take multiple ticks to fight
   });

   it("Checking that ties break the game", function(){
      dummy = new player.Player('ya','ya'); 
      armya = new armys.Army(dummy,1,null,null,null,null);
      armyb = new armys.Army(dummy,1,null,null,null,null);

      battle = new battles.Battle(armya,dummy,null,armyb,dummy,null,null,null,null);
      expect(battle.tick()).toBe(false);
      //Should end as tie because it is a 1v1
   });
});


