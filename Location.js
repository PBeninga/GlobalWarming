class Location {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	distance(x, y) {
		return Math.sqrt(Math.pow((x - this.x),2) + Math.pow((y - this.y),2))
	}

	angleTo(x, y) {
		return Math.atan2((y-this.y), (x-this.x));
	}

	moveTo(x, y) {
		this.x = x;
		this.y = y;
	}
}
module.exports = {
   Location:Location
};
