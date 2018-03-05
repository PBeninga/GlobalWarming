var mainmenu = {
  create: function(game) {
    game.add.plugin(PhaserInput.Plugin);
    console.log("Reached main menu");
    game.stage.backgroundColor = 0xADD8E6;

    var MenuBorder = game.add.graphics();
    // colour and opacity
    MenuBorder.beginFill(0x0000FF, 0.1);
    // size
    backWidth = 500;
    backHeight = 400;
    // centering
    MenuBorder.drawRect((canvas_width/2)-(backWidth/2), (canvas_height/2)-(backHeight/2), backWidth, backHeight);


    // start game
    this.createButton(game, "Game Start", 'button1', canvas_width/2, canvas_height/2 - 100, 1, function() {
      game.state.start('main');
    });
    this.createButton(game, "Login", 'button1', canvas_width/2, canvas_height/2, 1, this.login);
  },

  createButton: function(game, string, ident, x, y, scale, callback) {
    var tempButton = game.add.button(x, y, ident, callback, this, 2, 1, 0);
    tempButton.scale.set(scale,scale);
    tempButton.anchor.setTo(0.5, 0.5);
    tempButton.text = game.add.text(tempButton.x, tempButton.y, string, {
      font: "14px Arial",
      fill: "#fff",
      align: "center"
    });
    tempButton.text.anchor.setTo(0.5, 0.5);

    return tempButton;
  },

  login: function() {
    var LoginBorder = game.add.graphics();
    LoginBorder.beginFill(0xFFFFFF, 1);
    // size
    borderWidth = 600;
    borderHeight = 500;
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
      placeHolder: 'Password',
      type: PhaserInput.InputType.password
    };
    var password = game.add.inputField(inputLeft, inputTop, inputData);
    inputData.placeHolder = 'UserName';
    inputData.type = PhaserInput.InputType.UserName;
    var userName = game.add.inputField(inputLeft, inputTop - 60, inputData);

    var cancel = this.createButton(game, "Cancel", 'button1', maxLeft + 300, maxTop + 400, 1, function() {
      LoginBorder.destroy();
      password.destroy();
      userName.destroy();
      cancel.text.destroy();
      cancel.destroy();
    });
  }
}
