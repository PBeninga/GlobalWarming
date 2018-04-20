const { Given, When, Then, And } = require('cucumber');
const assert = require('assert');

Given('I start with an army of size {int}', function (input) {
  myPlayer.addArmy(input, dummyNode);
})
And('the node I want to go to has a an army of size {int} not owned by me', function (input) {
  enemy.addArmy(input, new gameMap.MapNode(0, 0, [], 1));
})
When('I send my army to that node', function (input) {
  myPlayer.armies[0].battle(enemy.armies[0]);
})
Then('my army has {int} troops', function (input) {
  assert.equal(myPlayer.armies[0].count, 50);
})
Then('their army has {int} troops', function (input) {
  assert.equal(enemy.armies[0].count, 50);
})
And('the enemy has {int} less army', function (input) {
  assert.equal(enemy.armies.length, 0);
})
And('I have {int} less army', function (input) {
  assert.equal(myPlayer.armies.length, 0);
})
