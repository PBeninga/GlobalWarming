var preloader = {
  preload: function() {
    // Add a loading label

    // Load all assets.
  },

  create: function() {
    console.log("Reached preloader");
    game.state.start('mainmenu');
  }
}
