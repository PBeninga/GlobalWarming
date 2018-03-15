var preloader = {
  preload: function() {
    // Add a loading label

    // Load all assets.
    game.load.image('node_img', 'client/assets/circle.png');
    game.load.image('button1', 'client/assets/blue_button00.png');
    game.load.image('button2', 'client/assets/blue_button01.png');
    game.load.image('button3', 'client/assets/blue_button02.png');
    game.load.image('button4', 'client/assets/blue_button03.png');
    game.load.image('button5', 'client/assets/blue_button04.png');
    game.load.bitmapFont('carrier_command', 'client/assets/carrier_command.png', 'client/assets/carrier_command.xml');
  },

  create: function() {
    console.log("Reached preloader");
    game.state.start('mainmenu');
  }
}
