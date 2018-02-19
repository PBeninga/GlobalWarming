canvas_width = window.innerWidth * window.devicePixelRatio;
canvas_height = window.innerHeight * window.devicePixelRatio;

game = new Phaser.Game(canvas_width,canvas_height, Phaser.CANVAS, 'gameDiv');

game.state.add('boot', boot);
game.state.add('preloader', preloader);
game.state.add('mainmenu', mainmenu);
game.state.add('main', main);

game.state.start('boot');
