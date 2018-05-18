var tickObject = require('./Tick.js');

class End extends tickObject.Tick{
	constructor() {
	}
	tick() {
		this.timeTillStart = TIME_TILL_START - (new Date().getTime() -this.gameStartTime);
      this.gameSocket.emit('updateTime',{time:this.timeTillStart});
	}
}
