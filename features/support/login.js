const { Given, When, Then, And } = require('cucumber');
const assert = require('assert');

Given("A login attempt", function() {return 'pending'});

When("The password matches the users password in the database", function() {return '[emding'});

Then("The server responds with a valid login response", function() {return 'pending'});

When("The password does not match the users password in the database", function() {return 'pending'});

Then("The server responds with an invalid login response", function() {return 'pending'});
