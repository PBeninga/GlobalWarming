const { Given, When, Then, And } = require('cucumber');
const assert = require('assert');

Given('I start with an army of size {int}', function (input) {
  this.addMyArmy(input);
})
Given('the node I want to go to has a an army of size {int} not owned by me', function (input) {
  this.addEnemyArmy(input);
})
When('I send my army to that node', function () {
  this.battle();
})
Then('my army has {int} troops', function (input) {
  console.log("Reached");
  assert.equal(this.myPlayer.armies[0].count, input);
})
Then('their army has {int} troops', function (input) {
  assert.equal(this.enemy.armies[0].count, input);
})
Then('the enemy has {int} army remaining', function (input) {
  assert.equal(this.enemy.armies.length, input);
})
Then('I have {int} army remaining', function (input) {
  assert.equal(this.myPlayer.armies.length, input);
})
