var socket;
var playerSocket;
var Login = function(game){};

function enterGame(){
   //So far this function is unneccesary, expected a use for it
   game.state.start('MainMenu');
}

function guest() {
   boop.play();
   enterGame();
}

function login() {
   boop.play();
   socket.emit(
      "login",
      {'data' : {'username': usernameInput.value, 'password' : passwordInput.value}}
   );
}

function loginHandler(data) {
   if(data.loginStatus === 'true'){ enterGame();}
   else {alert(data.error);}
}

function createAccount(){
   boop.play();
   socket.emit(
      "new_account",
      {'data' : {'username': usernameInput.value, 'password' : passwordInput.value}}
   );
}

function createAccountHandler(data){
   if(data.accountExists === 'true') {alert('Account Exists');}
   else {enterGame();}
}

Login.prototype = {
   create: function(game) {
      socket = io.connect();
      game.add.plugin(PhaserInput.Plugin);
      game.stage.backgroundColor = 0xADD8E6;

      var titleText = game.add.bitmapText((canvas_width/2) - 255, 100, 'carrier_command', ' Fort Knight\nBattle Royale', 32);

      socket.on('login', loginHandler);
      socket.on('new_account', createAccountHandler);
      
      var usernameInput = getInputField('UserName', PhaserInput.InputType.UserName, canvas_width/2, canvas_height/2-50);
      var passwordInput = getInputField('Password', PhaserInput.InputType.password, canvas_width/2,canvas_height/2);
      
      var loginButton = createButton(game, "Login", 'button1', canvas_width*3/8, canvas_height/2 + 100, 1, Login, login);
      var createAccountButton = createButton(game, "Create Account", 'button1', canvas_width*5/8, canvas_height/2 + 100, 1, Login, createAccount);
      var guestButton =  createButton(game, "Play as Guest", 'button1', canvas_width*4/8, canvas_height/2+200, 1, Login, guest);
   }
}
