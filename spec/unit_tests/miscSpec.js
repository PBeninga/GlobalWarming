describe("Misc Functions test", function() {
   var misc = require("../../MiscFunctions.js");

   it("should return a random id of given length", function() {
      var id = misc.generateID(7);
      expect(id.length).toBe(7);
   });

   it("should return differnet ids with successive calls", function() {
      var id1 = misc.generateID(4);
      var id2 = misc.generateID(4);
      expect(id1 === id2).toBe(false);
   });
});
