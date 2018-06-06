var database = require('./database/database.js');
var db = new database.Database();

//if we pass onlogin a callback, we can set the name of the player inside this onLogin promise.
// callback creates the player object
function onLogin(playerSocket, data, callback) {
   db.compareHash('Player', data).then(function(lgStatus) {
      status = lgStatus['isMatch'].toString() // isMatch is a boolean
      message = lgStatus['message'] // refers to an error
      callback(data["username"], status, message, playerSocket.id, playerSocket);
   });
}

function onNewAccount(playerSocket, data){
   query = {'username': data.username};
   db.findOne('Player', query).then(function(user) {
      if(user == null) { // Account doesn't exist. Let's create it.
         db.insertOne('Player', data);
         playerSocket.emit('new_account', {'accountExists' : 'false'});
         console.log("New Account Created");
      }
      else { 
         playerSocket.emit('new_account', {'accountExists' : 'true'});
         console.log("Account already exists");
      }
   });
}


module.exports = {
   onLogin:onLogin,
   onNewAccount:onNewAccount
}
