describe("Database constructor test", function() {
  it("checks if we can connect to the database", function() {

    var database = require('../../server/database/database.js');
	var db = new database.Database();

    expect(db).toEqual(db);
  });
});

describe("Database insert and remove test", function() {
  var database = require('../../server/database/database.js');
  var db = new database.Database();

  it("should insert a document correctly", function() {
     db.insertOne("Player", {"username": "unitTestPlayer", "password": "pass"}).then(function(err) {
        console.log("Inserted");
        expect(err).toEqual(null);
     }).then(db.remove("Player", {"username": "unitTestPlayer"})).then(function(err) {
        console.log("Removed");
        expect(err).toEqual(null);
     });
  });
});

describe("Database insert, find, and remove test", function() {
	var database = require('../../server/database/database.js');
	var db = new database.Database();

	it("should insert then find correctly", function() {
		db.insertOne("Player", {"username": "unitTestPlayer2", "password": "pass"}).then(function(err) {
	    	console.log("Inserted");
	    	expect(err).toEqual(null);
	 	}).then(db.findOne("Player", {"username": "unitTestPlayer2"})).then(function(err, docs) {
	    	expect(err).toEqual(null);
	 	}).then(db.remove("Player", {"username": "unitTestPlayer2"})).then(function(err) {
	    	console.log("Removed");
	    	expect(err).toEqual(null);
	 	});    
	});
});

describe("Database insert, fail to find find, and remove test", function() {
	var database = require('../../server/database/database.js');
	var db = new database.Database();

	it("should insert then not find the user", function() {
		db.insertOne("Player", {"username": "unitTestPlayer3", "password": "pass"}).then(function(err) {
	    	console.log("Inserted");
	    	expect(err).toEqual(null);
	 	}).then(db.findOne("Player", {"username": "DNE"})).then(function(err, docs) {
	    	expect(err).toEqual(null);
	 	}).then(db.remove("Player", {"username": "unitTestPlayer3"})).then(function(err) {
	    	console.log("Removed");
	    	expect(err).toEqual(null);
	 	});    
	});

});

describe("Database insert, give correct hash, and remove", function() {
	var database = require('../../server/database/database.js');
	var db = new database.Database();

	it("should insert then log in correctly", function() {
		db.insertOne("Player", {"username": "unitTestPlayer4", "password": "pass"}).then(function(err) {
	    	console.log("Inserted");
	    	expect(err).toEqual(null);
	 	}).then(db.compareHash("Player", {"username": "unitTestPlayer4", "password": "pass"})).then(function(err, docs) {
	    	expect(err).toEqual(null);
	 	}).then(db.remove("Player", {"username": "unitTestPlayer4"})).then(function(err) {
	    	console.log("Removed");
	    	expect(err).toEqual(null);
	 	});    
	});
});


describe("Database insert, give incorrect hash, and remove", function() {
	var database = require('../../server/database/database.js');
	var db = new database.Database();

	it("should insert then wrong credentials fail to log in", function() {
		db.insertOne("Player", {"username": "unitTestPlayer5", "password": "pass"}).then(function(err) {
	    	console.log("Inserted");
	    	expect(err).toEqual(null);
	 	}).then(db.compareHash("Player", {"username": "unitTestPlayer5", "password": "WRONG-PASS"})).then(function(err, docs) {
	    	expect(err).toEqual(null);
	 	}).then(db.remove("Player", {"username": "unitTestPlayer4"})).then(function(err) {
	    	console.log("Removed");
	    	expect(err).toEqual(null);
	 	});    
	});
});

describe("Database insert, compareHash with wring username, and remove", function() {
	var database = require('../../server/database/database.js');
	var db = new database.Database();

	it("should insert then wrong credentials fail to log in", function() {
		db.insertOne("Player", {"username": "unitTestPlayer6", "password": "pass"}).then(function(err) {
	    	console.log("Inserted");
	    	expect(err).toEqual(null);
	 	}).then(db.compareHash("Player", {"username": "wrong-name", "password": "pass"})).then(function(err, docs) {
	    	expect(err).toEqual(null);
	 	}).then(db.remove("Player", {"username": "unitTestPlayer4"})).then(function(err) {
	    	console.log("Removed");
	    	expect(err).toEqual(null);
	 	});    
	});
});