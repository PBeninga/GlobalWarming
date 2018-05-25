var database = require('./database/database.js');
var db = new database.Database();

//if we pass onlogin a callback, we can set the name of the player inside this onLogin promise.
// callback creates the player object
function onLogin(playerSocket, data, callback) {
   db.compareHash('Player', data).then(function(isMatch) {
      status = isMatch.toString() // isMatch is a boolean
      //playerSocket.emit('login', {'loginStatus' : status});
      if (isMatch){
         callback(data["username"], status, playerSocket.id, playerSocket);
      }
   });
}

function onNewAccount(playerSocket, data){
   db.findOne('Player', data).then(function(user) {
      if(user != null) {
         console.log("Account already exists");
         playerSocket.emit('new_account', {'accountExists' : 'true'});
      }
      else{
         console.log("New Account Created");
         db.insertOne('Player', data);
         playerSocket.emit('new_account', {'accountExists' : 'false'});
      }
   });
}


module.exports = {
   onLogin:onLogin,
   onNewAccount:onNewAccount
}
