var preloader = {
  preload: function() {
    // Add a loading label

    // Load all assets.
    game.load.image('node_img', 'client/assets/circle.png');
  },

  create: function() {
    console.log("Reached preloader");
    game.state.start('mainmenu');
  }
}
