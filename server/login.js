var database = require('./database/database.js');
var db = new database.Database();
var socketId;
var playerSocket;

class Login {
   constructor(sock, id) {
      playerSocket = sock;
      socketId = id;
   }

//if we pass onlogin a callback, we can set the name of the player inside this onLogin promise.
// callback creates the player object
   onLogin(data, callback) {
      db.compareHash('Player', data).then(function(isMatch) {
         var status = isMatch.toString() // isMatch is a boolean
         callback(playerSocket, data["username"], status, socketId);
      });
   }

   onNewAccount(data){
      db.findOne('Player', data).then(function(user) {
         if(user != null) {
            console.log("Account already exists");
            playerSocket.emit('new_account', {'accountExists' : 'true'});
         }
         else{
            console.log("New Account Created");
            db.insertOne('Player', data);
         }
      });
   }
}

module.exports = {
   Login:Login
}
