var web_app = require("../../app.js");

describe('Finding game tests', function(){

   console.log("Running app.js tests");
 
   it("Checks find game", function(){ 
   
      expect( (web_app.games.size == 0) ).toBe(true);
      web_app.findGame(000);
      
   });


 });
