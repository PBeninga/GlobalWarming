var canvas_width = window.innerWidth;
var canvas_height = window.innerHeight;

var game = new Phaser.Game(canvas_width,canvas_height, Phaser.CANVAS, 'gameDiv');

game.state.add('Preloader', Preloader);
game.state.add('Login', Login);
game.state.add('MainMenu', MainMenu);
game.state.add('Main', Main);

game.state.start('Preloader');
