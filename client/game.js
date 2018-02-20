canvas_width = window.innerWidth;
canvas_height = window.innerHeight;

game = new Phaser.Game(canvas_width,canvas_height, Phaser.CANVAS, 'gameDiv');

game.state.add('boot', boot);
game.state.add('preloader', preloader);
game.state.add('mainmenu', mainmenu);
game.state.add('main', main);

game.state.start('boot');
