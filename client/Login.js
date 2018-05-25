var socket;
var playerSocket;
var username = 'ERROR';
var password;
var Login = function(game){};

function enterGame(){
   //Destroy all stuffs
   //
   game.state.start('MainMenu');
}

function guest() {
   boop.play();
   username = 'idk';
   enterGame();
}

function login() {
   boop.play();
   username = usernameInput.value;
   socket.emit(
      "login", // Send following 'data' as data (in login.js) -> doc (in database.js)
      {'playerID': playerID, 'data' : {'username': usernameInput.value, 'password' : passwordInput.value}}
   );
}

function loginHandler(data) {
   console.log('loginhandling');
   if(data.loginStatus === 'true'){ enterGame();}
   else {alert(data);}
}

function createAccount(){
   boop.play();
   socket.emit(
      "new_account", // Send following 'data' as data (in login.js) -> doc (in database.js)
      {'playerID': playerID, 'data' : {'username': usernameInput.value, 'password' : passwordInput.value}}
   );
}

function createAccountHandler(data){
   if(data.accountExists === 'true') {alert('Account Exists');}
   else {enterGame();}
}

function getInputField(name,type,x,y,width){
   var width = canvas_width*3/5;
   inputData = {
      font: '18px Arial',
      fill: '#212121',
      fontWeight: 'bold',
      width: width,
      padding: 8,
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 6,
      placeHolder: name,
      type: type
   };
   return game.add.inputField(x-width/2, y, inputData);
}

Login.prototype = {
   create: function(game) {
      socket = io.connect();
      game.add.plugin(PhaserInput.Plugin);
      game.stage.backgroundColor = 0xADD8E6;

      titleText = game.add.bitmapText((canvas_width/2) - 255, 100, 'carrier_command', 'Global Warming', 32);

      socket.on('login', loginHandler);
      socket.on('new_account', createAccountHandler);
      
      usernameInput = getInputField('UserName', PhaserInput.InputType.UserName, canvas_width/2, canvas_height/2-50);
      passwordInput = getInputField('Password', PhaserInput.InputType.password, canvas_width/2,canvas_height/2);
      
      loginButton = createButton(game, "Login", 'button1', canvas_width*3/8, canvas_height/2 + 100, 1, Login, login);
      createAccountButton = createButton(game, "Create Account", 'button1', canvas_width*5/8, canvas_height/2 + 100, 1, Login, createAccount);
      guestButton =  createButton(game, "Play as Guest", 'button1', canvas_width*4/8, canvas_height/2+200, 1, Login, guest);
   }
}
