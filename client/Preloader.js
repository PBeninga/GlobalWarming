var menu_music;
var march;
var battle_music;
var boop;
var sounds;
//List of every sprite in sheet that we want accessible
units = [6,12,15,18,21,432,435,438,441,444,447,450,453,456,459,462,465,756,762,765,771,774,780]

var Preloader = {
  preload: function() {
    //loads all sounds
    var boop_vol = 1;
    var menu_music_vol = .7;
    var battle_sound_vol = .9;
    var march_vol = 1;
    var battle_music_vol = .7;
    sounds = [];

    //saves each sound into a list of sounds paired with volume(for ratio)
    boop = getSound('/client/assets/boop.mp3',boop_vol,false);
    sounds.push([boop,boop_vol]);
    menu_music = getSound('/client/assets/menu_music.mp3',menu_music_vol,true);
    sounds.push([menu_music,menu_music_vol]);
    battle_music = getSound('/client/assets/battle_music.mp3',battle_music_vol,true);
    sounds.push([battle_music,battle_music_vol]);
    march = getSound('/client/assets/march.mp3',march_vol,false);
    sounds.push([march,march_vol]);
    battle_sound = getSound('/client/assets/battle_sound.mp3',battle_sound_vol,false);
    sounds.push([battle_sound,battle_sound_vol]);

    //loads all graphics
    game.load.spritesheet('win', 'client/assets/win.png', 16, 16);
    game.load.spritesheet('armies', 'client/assets/armies.png', 16, 16, -1, 0, 1);
    game.load.spritesheet('battle', 'client/assets/battle.png', 128, 128);
    game.load.image('castle_img', 'client/assets/castle.png');
    game.load.image('node_img', 'client/assets/node.png');
    game.load.image('tiny_button', 'client/assets/tiny_button.png');
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
