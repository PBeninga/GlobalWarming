class MovingArmy {
	constructor(army, startX, startY, endX, endY) {
		this.army = army;
		this.startX = startX;
		this.startY = startY;
		this.endX = endX;
		this.endY = endY;
	}



	tick() {

	}
}
/*
var currentMoving = this.movingArmies[i];
var startNode = this.map.nodes[currentMoving.nodes[0]];
var endNode = this.map.nodes[currentMoving.nodes[1]];
currentMoving.percentage += 5;
// if the army is done moving
if(this.moveArmy(currentMoving.army, startNode, endNode, currentMoving.percentage) >= 100){
	// Adds a dummy army for the army to "fight" if none exists
	if(endNode.army == null) {
		endNode.army = this.dummyPlayer.addArmy(0, endNode);
		console.log("Created army " + endNode.army.id + " as a dummy army");
	}
	//battle the occupying army
	this.battle(endNode, currentMoving.army, endNode.army);
	//Remove the finished movingArmy from the list
	var finished  = this.movingArmies.splice(i,1)[0];
	//Call moveArmies again if the swipelist continues
	if(finished.nodes.length > 2){
		finished.nodes.shift();
		this.queueMoveArmy(finished.nodes, finished.army.id, this.playerPool.getPlayer(finished.army.player));
	}
}

moveArmy(army, startNode, endNode, percent) {
	if(percent >= 100) {
		percent = 100;
	}
	var xDist = endNode.x - startNode.x;
	var yDist = endNode.y - startNode.y;
	army.x = startNode.x + (xDist * (percent/100));
	army.y = startNode.y + (yDist * (percent/100));
	return percent;
}
*/
