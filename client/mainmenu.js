var mainmenu = {
  create: function(game) {
    this.createButton(game, "Flavor Text", game.world.centerX, game.world.centerY + 100, 300, 100,
      function() {
        game.state.start('main');
      }
    );
  }

  update: function(game) {

  }

  createButton: function(game, string, x, y, w, h, callback) {
    var tempButton = game.add.button(x, y, 'button', callback, this, 2, 1, 0);

    tempButton.anchor.setTo(0.5, 0.5);
    tempButton.width = w;
    tempButton.height = h;
    var text = game.add.text(tempButton.x, tempButton.y, string, {
      font: "14px Arial",
      fill: "#fff",
      align: "center"
    });
    text.anchor.setTo(0.5, 0.5);
  }
}
