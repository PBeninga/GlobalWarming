
describe("Database constructor", function() {
  it("checks if we can connect to the database", function() {

    var database = require('./database/database.js');
	var db = new database.Database();

    expect(db).toEqual(db);
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
