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
    var text = game.add.text(tempButton.x, tempButton.y, string, {
      font: "14px Arial",
      fill: "#fff",
      align: "center"
    });
    text.anchor.setTo(0.5, 0.5);
  },

  login: function() {
    var LoginBorder = game.add.graphics();
    LoginBorder.beginFill(0xFFFFFF, 1);
    // size
    backWidth = 600;
    backHeight = 500;
    // centering
    LoginBorder.drawRect((canvas_width/2)-(backWidth/2), (canvas_height/2)-(backHeight/2), backWidth, backHeight);
  }
}
