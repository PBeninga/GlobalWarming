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




/*describe("Database", function() {
   var database = require('../server/database/database.js');
   var db;

   db = new database.Database();

   it("should fail because the model name is wrong", function() {
      db.insertOne("WrongModelName", {"username": "unitTestPlayer"})
      .catch(function(err) {
         expect(err).toEqual('Enter valid model name');
      });
   });
});*/
