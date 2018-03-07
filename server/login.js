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
      db.findOne('Player', data).then(function(user) {
         console.log(user);
         if(user === null) playerSocket.emit('login', {'loginStatus' : 'false'});
         else playerSocket.emit('login', {'loginStatus' : 'true'});
      });
   }
}

module.exports = {
   Login:Login
}
