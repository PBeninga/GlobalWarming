describe("Login test", function() {
   var dbAccess = require("../../server/dbAccess.js")
   var database = require("../../server/database/database.js");
   dbAccess.db = new database.Database();

   var truthycallback = function(user, status, message, id, playerSocket) {
      expect(status).toBe(true)
   }

   var falseycallback = function(user, status, message, id, playerSocket) {
      expect(status).toBe(false)
   }  

   it("should login successfully", function() {
      dbAccess.onLogin(null, {"username" : "max", "password": "max"}, truthycallback);
   });

   it("should not login successfully", function() {
      dbAccess.onLogin(null, {"username" : "max", "password": "notgoodpassword"}, falseycallback);
   });

   it("should also not login successfuly because account doesnt exist", function() {
      dbAccess.onLogin(null, {"username" : "notanaccount", "password": "notgoodpassword"}, falseycallback);
   });
});
