var database = require('./database/database.js');
var db = new database.Database();

//if we pass onlogin a callback, we can set the name of the player inside this onLogin promise.
// callback creates the player object
function onLogin(playerSocket, data, callback) {
   db.compareHash('Player', data).then(function(lgStatus) {
      status = lgStatus['isMatch'].toString() // isMatch is a boolean
      playerSocket.emit('login', {'loginStatus' : status, 'error': lgStatus['message']});
      if (lgStatus['isMatch']){
         callback(data["username"], status, playerSocket.id, playerSocket);
      }
   });
}

function onNewAccount(playerSocket, data){
   query = {'username': data.username};
   db.findOne('Player', query).then(function(user) {
      if(user != null) {
         console.log("Account already exists");
         playerSocket.emit('new_account', {'accountExists' : 'true'});
         return
      }
      console.log("New Account Created");
      db.insertOne('Player', data).then(function() {
         playerSocket.emit('new_account', {'accountExists' : 'false'});
      });
   });
}


module.exports = {
   onLogin:onLogin,
   onNewAccount:onNewAccount
}
