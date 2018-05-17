var socket;
var playerID = createID();
var playerSocket;
var menuFlag = 0;
var titleText;
var startButton;
var loginButton;
var createAccountButton;
var mainmenu = function(game){};
var username = 'guest';

function createBaseButtons() {
  startButton = createButton(game, "Game Start", 'button1', canvas_width*3/8, canvas_height/2 - 100, 1, function() {
    game.state.start('main', true, false, [socket,username]);
  });
  loginButton = createButton(game, "Login", 'button1', canvas_width*3/8, canvas_height/2, 1, login);
  createAccountButton = createButton(game, "Create Account", 'button1', canvas_width*3/8, canvas_height/2 + 100, 1, createAccount);
  chooseUnitButton = createButton(game, "Change Avatar", 'button1', canvas_width*3/8, canvas_height/2 + 200, 1, nextUnit);
}

var army;
var chosenUnit = 0;
function makeUnit(unit){
   temp = game.add.sprite(canvas_width/2+100,canvas_height/2,'armies');
   temp.animations.add('walk',[unit,unit+1,unit+2],1,true);
   temp.scale.setTo(1,1);
   temp.animations.play('walk',3,true);
   return temp;
}
function nextUnit(){
   army.destroy()
   chosenUnit += 1;
   if(chosenUnit >= units.length){
      chosenUnit = 0;
   }
   unit = units[chosenUnit];
   army = makeUnit(unit)
   console.log(unit);
}

function destroyBaseButtons() {
  startButton.destroy();
  loginButton.destroy();
  createAccountButton.destroy();
}

function createButton(game, string, ident, x, y, scale, callback) {
  var tempButton = game.add.button(x, y, ident, callback, mainmenu, 2, 1, 0);
  tempButton.scale.set(scale,scale);
  tempButton.anchor.setTo(0.5, 0.5);
  tempButton.text = game.add.text(tempButton.x, tempButton.y, string, {
    font: "14px Arial",
    fill: "#fff",
    align: "center"
  });
  tempButton.text.anchor.setTo(0.5, 0.5);

  return tempButton;
}

function createAccount() {
   if(menuFlag == 1) return;
   menuFlag = 1;
   destroyBaseButtons();

   var AccountBorder = game.add.graphics();
   AccountBorder.beginFill(0xFFFFFF, 1);
   borderWidth = 500;
   borderHeight = 400;
   maxLeft = (canvas_width/2)-(borderWidth/2);
   maxTop = (canvas_height/2)-(borderHeight/2);

   AccountBorder.drawRect(maxLeft, maxTop, borderWidth, borderHeight);

   inputWidth = borderWidth * 0.8
   inputHeight = 10
   inputLeft = maxLeft + ((borderWidth/2) - (inputWidth/2));
   inputTop = maxTop + ((borderHeight/2) - (inputHeight/2));
   inputData = {
      font: '18px Arial',
      fill: '#212121',
      fontWeight: 'bold',
      width: inputWidth,
      padding: 8,
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 6,
      placeHolder: 'UserName',
      type: PhaserInput.InputType.UserName
   };
   var userName = game.add.inputField(inputLeft, inputTop - 60, inputData);
   inputDataTwo = {
      font: '18px Arial',
      fill: '#212121',
      fontWeight: 'bold',
      width: inputWidth,
      padding: 8,
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 6,
      placeHolder: 'Password',
      type: PhaserInput.InputType.password
   };
   var password = game.add.inputField(inputLeft, inputTop, inputDataTwo);

   var login;
   var cancel = createButton(game, "Cancel", 'button1', maxLeft + 250, maxTop + 350, 1, function() {
      AccountBorder.destroy();
      password.destroy();
      userName.destroy();
      cancel.text.destroy();
      cancel.destroy();
      login.text.destroy();
      login.destroy();
      menuFlag = 0;
      createBaseButtons();
   });


   login = createButton(game, "Make Account", 'button1', maxLeft + 250, maxTop + 280, 1, function() {
      AccountBorder.destroy();
      password.destroy();
      userName.destroy();
      cancel.text.destroy();
      cancel.destroy();
      login.text.destroy();
      login.destroy();
      menuFlag = 0;
      socket.emit("new_account", // Send following 'data' as data (in login.js) -> doc (in database.js)
        {'playerID': playerID, 'data' : {'username': userName.value, 'password' : password.value}});
      createBaseButtons();
   });
}

function login() {
   if(menuFlag == 1) return;
   menuFlag = 1;
   destroyBaseButtons();
  var LoginBorder = game.add.graphics();
  LoginBorder.beginFill(0xFFFFFF, 1);
  // size
  borderWidth = 500;
  borderHeight = 400;
  maxLeft = (canvas_width/2)-(borderWidth/2);
  maxTop = (canvas_height/2)-(borderHeight/2);
  // centering
  LoginBorder.drawRect(maxLeft, maxTop, borderWidth, borderHeight);

  inputWidth = borderWidth * 0.8
  inputHeight = 10
  inputLeft = maxLeft + ((borderWidth/2) - (inputWidth/2));
  inputTop = maxTop + ((borderHeight/2) - (inputHeight/2));
  inputData = {
    font: '18px Arial',
    fill: '#212121',
    fontWeight: 'bold',
    width: inputWidth,
    padding: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    placeHolder: 'UserName',
    type: PhaserInput.InputType.UserName
  };
  var userName = game.add.inputField(inputLeft, inputTop - 60, inputData);
  inputDataTwo = {
    font: '18px Arial',
    fill: '#212121',
    fontWeight: 'bold',
    width: inputWidth,
    padding: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    placeHolder: 'Password',
    type: PhaserInput.InputType.password
  };
  var password = game.add.inputField(inputLeft, inputTop, inputDataTwo);

  var login;
  var cancel = createButton(game, "Cancel", 'button1', maxLeft + 250, maxTop + 350, 1, function() {
    LoginBorder.destroy();
    password.destroy();
    userName.destroy();
    cancel.text.destroy();
    cancel.destroy();
    login.text.destroy();
    login.destroy();
    menuFlag = 0;
    createBaseButtons();
  });


  login = createButton(game, "Login", 'button1', maxLeft + 250, maxTop + 280, 1, function() {
    username = userName.value;
    LoginBorder.destroy();
    password.destroy();
    userName.destroy();
    cancel.text.destroy();
    cancel.destroy();
    login.text.destroy();
    login.destroy();
    menuFlag = 0;
    socket.emit("login", // Send following 'data' as data (in login.js) -> doc (in database.js)
      {'playerID': playerID, 'data' : {'username': userName.value, 'password' : password.value}});
    createBaseButtons();
  });
}
function createID() {
   return Math.random().toString(36).substr(2, 10);
}
function processLogin(data) {
   if(data.loginStatus === 'true') game.state.start('main', true, false, [socket,username]);
   else login();
}
function processAccountCreation(data) {
   console.log('Test Account Socket');
   if(data.accountExists === 'true') createAccount();
}

mainmenu.prototype = {
 create: function(game) {
    socket = io.connect();
    game.add.plugin(PhaserInput.Plugin);
    console.log("Reached main menu");
    game.stage.backgroundColor = 0xADD8E6;
    titleText = game.add.bitmapText((canvas_width/2) - 255, 100, 'carrier_command', 'Global Warming', 32);

    var MenuBorder = game.add.graphics();
    // colour and opacity
    MenuBorder.beginFill(0x0000FF, 0.1);
    // size
    backWidth = 500;
    backHeight = 400;
    // centering
    MenuBorder.drawRect((canvas_width/2)-(backWidth/2), (canvas_height/2)-(backHeight/2), backWidth, backHeight);


    // start game
    createBaseButtons();
    unit = units[chosenUnit];
    army = makeUnit(unit);

    socket.on('login', processLogin);
    socket.on('new_account', processAccountCreation);
  }
}
