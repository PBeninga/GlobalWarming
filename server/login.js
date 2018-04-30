var database = require('./database/database.js');
var db = new database.Database();
var socketId;
var playerSocket;

class Login {
   constructor(sock, id) {
      playerSocket = sock;
      socketId = id;
   }

   onLogin(data) { 
      db.tryLogin('Player', data).then(function(isMatch) {
         playerSocket.emit('login', {'loginStatus' : isMatch.toString()});
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
