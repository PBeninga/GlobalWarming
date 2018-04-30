class MovingArmy {
	constructor(army, swipeList, nodeList) {
		this.army = army;
		this.startIndex = 0; // The location where the node will begin from. It will end at startIndex + 1
		this.swipeList = swipeList;
		this.nodeList = nodeList; // Used to detect battles

		this.angle = 0; // in radians
		this.distance = 0;
		this.moveX = 0;
		this.moveY = 0;

		this.percent = 0;
		this.movePercent = 0;
		this.initialize()
	}

	// Initializes the angle, distance, percent, and movement per tick based on the current startIndex
	initialize() {
		var startX = this.swipeList[this.startIndex].x
		var startY = this.swipeList[this.startIndex].y
		var endX = this.swipeList[this.startIndex + 1].x
		var endY = this.swipeList[this.startIndex + 1].y
		this.angle = Math.atan2((endY-startY), (endX-startX));
		this.distance = Math.sqrt(Math.pow((endX - startX),2) + Math.pow((endY - startY),2));
		this.moveX = this.army.movementSpeed * Math.cos(this.angle);
		this.moveY = this.army.movementSpeed * Math.sin(this.angle);

		this.percent = 0;
		this.movePercent = (this.army.movementSpeed / this.distance) * 100;
	}

	// Moves the startIndex, and returns false if the swipePath is complete
	moveUpList() {
		this.startIndex++;
		if(this.startIndex >= (this.swipeList.length - 1)) {
			return false;
		}
		this.initialize();
		return true;
	}

	// returns true if the army is still moving, false otherwise
	// updates the armys variables
	tick() {
		this.army.x += this.moveX;
		this.army.y += this.moveY;

		this.percent += this.movePercent;
		if(this.percent >= 100) {
			this.army.x = this.swipeList[this.startIndex+1].x;
			this.army.y = this.swipeList[this.startIndex+1].y;
			return false;
		}
		return true;
	}
}

module.exports = {
   MovingArmy:MovingArmy
};
