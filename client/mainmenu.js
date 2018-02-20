var mainmenu = {
  create: function(game) {
    console.log("Reached main menu");
    game.stage.backgroundColor = 0xADD8E6;

    var background = game.add.graphics();
    // colour
    background.beginFill(0x0000FF);
    // size
    backWidth = 500;
    backHeight = 200;
    // opacity
    background.alpha = 0.1;
    // centering
    background.drawRect((canvas_width/2)-(backWidth/2), (canvas_height/2)-(backHeight/2), backWidth, backHeight);

    this.createButton(game, null, canvas_width/2, canvas_height/2, 0.4, function() {
      game.state.start('main');
    });
  },

  createButton: function(game, string, x, y, scale, callback) {
    var tempButton = game.add.button(x, y, 'button', callback, this, 2, 1, 0);
    tempButton.scale.set(scale,scale);
    tempButton.anchor.setTo(0.5, 0.5);
    var text = game.add.text(tempButton.x, tempButton.y, string, {
      font: "14px Arial",
      fill: "#fff",
      align: "center"
    });
    text.anchor.setTo(0.5, 0.5);
  },
}
