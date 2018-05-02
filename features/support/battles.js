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
   assert.notEqual(this.battle, null);
})
Then('a battle commences', function () {
   this.commenceBattle();
})
Then('the enemy army gets destroyed', function () {
   assert.equal(this.enemy.armies.length, 0);
})
Then('Then that node holds my army', function (input) {
   assert.equal(this.map.nodes[0].army.id, this.myPlayer.armies[0].id);
})
Then('my army gets destroyed', function (input) {
   assert.equal(this.myPlayer.armies.length, 0);
})
Then('Then that node holds the enemies army', function (input) {
   assert.equal(this.map.nodes[0].army.id, this.enemy.armies[0].id);
})
