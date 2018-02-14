var boot = {

  create: function() {
      console.log("Reached Boot");
      game.stage.disableVisibilityChange = true;
      game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
      game.world.setBounds(0, 0, gameProperties.gameWidth, gameProperties.gameHeight, false, false, false, false);
  		game.physics.startSystem(Phaser.Physics.P2JS);
      game.physics.p2.setBoundsToWorld(false, false, false, false, false);
      game.physics.p2.gravity.y = 0;
      game.physics.p2.applyGravity = false;
      game.physics.p2.enableBody(game.physics.p2.walls, false);

      // physics start system
      // game.physics.p2.setImpactEvents(true);


      game.state.start('preloader');
  }
}
