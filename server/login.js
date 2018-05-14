var database = require('./database/database.js');
var db = new database.Database();
var socketId;
var playerSocket;

class Login {
   constructor(sock, id) {
      playerSocket = sock;
      socketId = id;
   }

//if we pass onlogin a player object or callback, we can set the username inside this onLogin promise.
   onLogin(data) { 
      db.compareHash('Player', data).then(function(isMatch) {
         status = isMatch.toString()
         playerSocket.emit('login', {'loginStatus' : status});
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
