var armys = require("../../Army.js");
var battles = require("../../Battle.js");
var player = require("../../Player.js");


describe('Test battles', function(){

   it("Checking that battle ends", function(){ 
      dummya = new player.Player('ya','ya'); 
      dummyb = new player.Player('na','na'); 
      armya = new armys.Army(dummya,100,null,null,null,null);
      armyb = new armys.Army(dummyb,1,null,null,null,null);

      battle = new battles.Battle(null,null,null);
      battle.addArmy(armya,dummya,null);
      battle.addArmy(armyb,dummyb,null);
      expect(battle.tick()).toBe(false);
      //battle should end because one army has 100 while the other has 1;
   });

   it("Checking that battle does not end off the bat", function(){
      dummya = new player.Player('ya','ya'); 
      dummyb = new player.Player('na','na');
      armya = new armys.Army(dummya,100,null,null,null,null);
      armyb = new armys.Army(dummyb,100,null,null,null,null);
      
      battle = new battles.Battle(null,null,null);
      battle.addArmy(armya,dummya,null);
      battle.addArmy(armyb,dummyb,null);
      expect(battle.tick()).toBe(true);
      //Shouldn't end because these are large armies, take multiple ticks to fight
   });

   it("Checking that armies merge", function(){
      dummya = new player.Player('ya','ya'); 
      armya = new armys.Army(dummya,1,null,null,null,null);
      armyb = new armys.Army(dummya,1,null,null,null,null);
      
      battle = new battles.Battle(null,null,null);
      battle.addArmy(armya,dummya,null);
      battle.addArmy(armyb,dummya,null);
      expect(battle.tick()).toBe(false);
      //Should end because there are no enemies
   });
});


