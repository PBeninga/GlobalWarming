var menu_music;
var march;
var battle_music;
var boop;

var Preloader = {
  preload: function() {
    // Add a loading label

    // Load all assets.
    boop = getSound('/client/assets/boop.mp3',.9,false);
    menu_music = getSound('/client/assets/menu_music.mp3',.6,true);
    battle_music = getSound('/client/assets/battle_music.mp3',.5,true);
    march = getSound('/client/assets/march.mp3',1,false);
    battle_sound = getSound('/client/assets/battle_sound.mp3',.5,false);
    game.load.spritesheet('win', 'client/assets/win.png', 16, 16);
    game.load.spritesheet('armies', 'client/assets/armies.png', 16, 16, -1, 0, 1);
    game.load.spritesheet('battle', 'client/assets/battle.png', 128, 128);
    game.load.image('castle_img', 'client/assets/castle.png');
    game.load.image('node_img', 'client/assets/node.png');
    game.load.image('button1', 'client/assets/blue_button00.png');
    game.load.image('button2', 'client/assets/blue_button01.png');
    game.load.image('button3', 'client/assets/blue_button02.png');
    game.load.image('button4', 'client/assets/blue_button03.png');
    game.load.image('button5', 'client/assets/blue_button04.png');
    game.load.image('background_img', 'client/assets/ground.png');
    game.load.bitmapFont('carrier_command', 'client/assets/carrier_command.png', 'client/assets/carrier_command.xml');
  },

  create: function() {
    console.log("Reached preloader");
    game.state.start('Login')
  }
}
