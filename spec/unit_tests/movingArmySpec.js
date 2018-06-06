var armyObject = require("../../Army.js");
var movingArmyObject = require("../../MovingArmy.js");
var mapObject = require("../../Map.js");
var playerObject = require("../../Player.js");



describe('Test moving armies', function(){

   console.log("Running moving army unit Tests");

   it("Checking that moving army initializes properly", function(){
		var dummy = new playerObject.Player('ya','ya');
		var nodea = new mapObject.MapNode(0, 0, [1], 0);
		var nodeb = new mapObject.MapNode(100, 0, [0], 1);
      var army = new armyObject.Army(dummy,100,nodea,0,0,null);

		var swipePath = [];
		swipePath.push({x:nodea.x, y:nodea.y});
		swipePath.push({x:nodeb.x, y:nodeb.y});

		var movingArmy = new movingArmyObject.MovingArmy(army, swipePath, null);
		expect(movingArmy.angle).toEqual(Math.atan2(0, 100));
		expect(movingArmy.distance).toEqual(48);
		expect(movingArmy.moveX).toEqual(army.movementSpeed * Math.cos(movingArmy.angle));
		expect(movingArmy.moveY).toEqual(army.movementSpeed * Math.sin(movingArmy.angle));
		expect(movingArmy.percent).toEqual(0);
		expect(movingArmy.movePercent).toEqual((army.movementSpeed / movingArmy.distance) * 100);
      //battle should end because one army has 100 while the other has 1;
   });

	it("Checking the moving army moveUp function ends properly", function(){
		var dummy = new playerObject.Player('ya','ya');
		var nodea = new mapObject.MapNode(0, 0, [1], 0);
		var nodeb = new mapObject.MapNode(100, 0, [0], 1);
		var army = new armyObject.Army(dummy,100,nodea,0,0,null);

		var swipePath = [];
		swipePath.push({x:nodea.x, y:nodea.y});
		swipePath.push({x:nodeb.x, y:nodeb.y});

		var movingArmy = new movingArmyObject.MovingArmy(army, swipePath, null);
		expect(movingArmy.moveUpList()).toBe(false);
		//battle should end because one army has 100 while the other has 1;
	});

	it("Checking the moving army moveUp function continues properly", function(){
		var dummy = new playerObject.Player('ya','ya');
		var nodea = new mapObject.MapNode(0, 0, [1], 0);
		var nodeb = new mapObject.MapNode(100, 0, [0, 2], 1);
		var nodec = new mapObject.MapNode(100, 100, [1], 2);
		var army = new armyObject.Army(dummy,100,nodea,0,0,null);

		var swipePath = [];
		swipePath.push({x:nodea.x, y:nodea.y});
		swipePath.push({x:nodeb.x, y:nodeb.y});
		swipePath.push({x:nodec.x, y:nodec.y});

		var movingArmy = new movingArmyObject.MovingArmy(army, swipePath, null);
		expect(movingArmy.moveUpList()).toBe(true);
		//battle should end because one army has 100 while the other has 1;
	});

	it("Checking the moving army tick function iterates properly", function(){
		var dummy = new playerObject.Player('ya','ya');
		var nodea = new mapObject.MapNode(0, 0, [1], 0);
		var nodeb = new mapObject.MapNode(100, 0, [0, 2], 1);
		var nodec = new mapObject.MapNode(100, 100, [1], 2);
		var army = new armyObject.Army(dummy,100,nodea,0,0,null);

		var swipePath = [];
		swipePath.push({x:nodea.x, y:nodea.y});
		swipePath.push({x:nodeb.x, y:nodeb.y});
		swipePath.push({x:nodec.x, y:nodec.y});

		var movingArmy = new movingArmyObject.MovingArmy(army, swipePath, null);

		expect(movingArmy.tick()).toBe(true);
		expect(movingArmy.percent).toEqual(movingArmy.movePercent);
		expect(army.x).toEqual(movingArmy.moveX);
		expect(army.y).toEqual(movingArmy.moveY);
		//battle should end because one army has 100 while the other has 1;
	});
});
