const { Given, When, Then} = require('cucumber');
const assert = require('assert');

Given('I have an army of size {int} on a node', function (input) {
  this.addMyArmy(input);
})
When('I send my army to another node', function () {
  this.moveArmy();
})
Then('my army will be on the other node', function () {
  assert.equal(this.myPlayer.armies[0].x, this.game.map.nodes[1].x);
  assert.equal(this.myPlayer.armies[0].y, this.game.map.nodes[1].y);
})
