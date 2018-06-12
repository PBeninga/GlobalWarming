var socket;
var username;//socket = io.connect();
var gameSocket;
//the player list
var players = [];
var battles = [];
var ClientPlayer;
var DummyPlayer;

var nodes;
var swipePath;
var gameId;
var lines;
// Used for image heirarchy in phaser
var nodeGroup;
var armyGroup;

// selected units are
var units;
var unitTaken;
var bannerGFX;
var bannerGFXMarker;
var bannerBox;
var leaveButton;
var circle;

function TRASHCODE() {
   players = [];
   battles = [];
   ClientPlayer = null;
   DummyPlayer = new Player(null, 0x000000);
   players.push(DummyPlayer);
   nodes = [];
   swipePath = [];
   lines = [];
   nodeGroup = null;
   armyGroup = null;
   unitTaken = [];
   for(unit of units){
      unitTaken.push(false);
   }
}


var Main = function(game){
};

function onsocketConnected (data) {
	console.log("connected to server");
	console.log(this.id + " " + data.id);
	gameId = data.game
	console.log(gameId);
	gameSocket = io(gameId);
	gameSocket.on('update_armies', updateArmies);
	gameSocket.on('update_circle', updateCircle);
        gameSocket.on('players', displayPlayers);
	gameSocket.on('remove_player', onRemovePlayer);
	gameSocket.on('endGame',endGame);
	gameSocket.on('newPlayer', onNewPlayer);
	gameSocket.on('updateTime', onUpdateTime);
	gameSocket.on('startGame',onStart);
   gameSocket.on('battle_start',startBattle);
   gameSocket.on('battle_end',removeBattle);

	ClientPlayer = addNewPlayer(this.id);
	for(var i = 0; i < data.players.length; i++) {
		if(data.players[i].id !=  this.id){
			addNewPlayer(data.players[i].id);
		}
	}
	// send the server our initial position and tell it we are connected
}

function updateCircle(data){
   width = 2000
   circle.clear();
   circle.lineStyle(width, 0x6b346a,.5);
   circle.drawCircle(data.x,data.y,data.r*2+width);
}
function onStart(){
	bannerGFX.destroy();
	bannerGFX = game.add.text(game.camera.x,game.camera.y, "Fight!",{
		font: "70px Arial",
		fill: "#FFFFFF",
		align: "center"
	});
	bannerGFXMarker = 'Fight';
   battle_music.play();
	setTimeout(function(){bannerGFX.destroy();bannerGFX = null;bannerGFXMarker = null}, 5000);
}

function onUpdateTime(data){
	if(bannerGFX){
		bannerGFX.destroy();
	}
	let text = "Game starting in: " + data.time/1000;
	bannerGFX = game.add.text(game.camera.x,game.camera.y, text,{
		font: "70px Arial",
		fill: "#FFFFFF",
		align: "center"
	});
	bannerGFXMarker = 'Time';
}

function endGame(data){
	if(ClientPlayer.id == data.winner){
		displayWin();
	}else{
		displayLoss();
	}
}

function displayLoss(){
	bannerGFX.destroy();
	bannerGFX = game.add.text(game.camera.x,game.camera.y, "You Suck!",{
		font: "70px Arial",
		fill: "#FFFFFF",
		align: "center"
	});
	bannerGFXMarker = 'Loss';
}
function displayWin(){
	bannerGFX.destroy();
	bannerGFX= game.add.text(game.camera.x,game.camera.y, "Winner!",{
		font: "70px Arial",
		fill: "#FFFFFF",
		align: "center"
	});
	bannerGFXMarker = 'Win';
}

function displayPlayers(players) {
	if(bannerGFXMarker != null) {
		return;
	}
   playerString = "";
   plays = players.players;
   for(var i = 1; i < plays.length; i++) {
      name = plays[i]['name'];
      if(!name) {
         name = 'guest';
      }
      playerString = playerString.concat(plays[i]['name'], '\n');
   }
   console.log(playerString);
	if(bannerGFX != null && playerString == bannerGFX.text) {
		return;
	}
	if(bannerGFX != null) {
		bannerGFX.destroy();
	}
   bannerGFX = game.add.text(game.camera.x, game.camera.y, playerString, {
      font: "28px Arial",
      fill: "#FFFFFF",
      align: "left"
   });
}
// When the server notifies us of client disconnection, we find the disconnected
// enemy and remove from our game
function onRemovePlayer (data) {
	if (!removePlayer(data.id)) {
		console.log('Player not found: ', data.id)
	}
}

// Removes the player from the players list and opens their unit up for reassignment
function removePlayer(id) {
	if(!id) {
		return false;
	}
	for(var i = 0; i < players.length; i++) {
		if(players[i].id == id) {
			clearUnit(players[i].unit);
			players.splice(i, 1);
			return true
		}
	}
	return false;
}

// Adds a new player to the player list with the given id. Also gets a unit from getUnit.
function addNewPlayer(id) {
   if(id == null) {
		return DummyPlayer;
   }
   var newPlayer = findplayerbyid(id);
   if(newPlayer.id != DummyPlayer.id) {
      return newPlayer;
   }
   var unit;
   if(id == socket.id){
	 unit = units[chosenUnit];    // WHERE SELECTED UNIT WILL GO
         unitTaken[chosenUnit] = true
   } else{
      menu_music.pause();
      unit = getUnit();
   }
   let player = new Player(id, unit);
   players.push(player);
   return player;
}

// Called when a player exits. Allows their unit to be used again.
function clearUnit(unit) {
	for(var i = 0; i < units.length; i++) {
		if(unit == units[i]) {
			unitTaken[i] = false;
		}
	}
}

// Returns a unit from the units list, so long as it isn't taken.
// TODO: Loop through colors
function getUnit() {
   if(!unitTaken.includes(false)){
      console.log("To many players, assigning already used unit.");
      return units[Math.floor(Math.random() * units.length)];
   }

   var index = Math.floor(Math.random() * units.length);
   while(unitTaken[index]) {
      index++;
   }
   unitTaken[index] = true;
   return units[index];
}

// Called when a user clicks on a node.
function swipe() {
	// If the army isn't owned by this client, do nothing.
	if(this.army.owner.id != ClientPlayer.id) {
		console.log("That's not your army! Army at " + this.army.x + "," + this.army.y + " is owned by " + this.army.owner.id);
	}
	else if(swipePath.length == 0){
		console.log("Army at " + this.army.x + "," + this.army.y + " is owned by " + this.army.owner.id);
		swipePath.push(findnodebyloc(this.army.x, this.army.y));
		lines.push(new Phaser.Line(this.army.x, this.army.y, game.input.mousePointer.x, game.input.mousePointer.y));
	}
}

// Called when the mouse hovers over the node passed in the parameter.
// Adds the node to the swipePath if a swipe was initialized.
function mouseOver() {
	console.log("Mouse is over node " + this.node.id + " at " + this.node.x + ", " + this.node.y);
	if(swipePath.length != 0) {
		if(swipePath[swipePath.length-1].pathTo(this.node) != null && swipePath[swipePath.length-1].id != this.node.id) {
			swipePath.push(this.node);
			lines[lines.length-1].end = new Phaser.Point(this.node.x, this.node.y);
			lines.push(new Phaser.Line(this.node.x, this.node.y, game.input.mousePointer.x + game.camera.x, game.input.mousePointer.y+ game.camera.y));
		}
	}
}

// Ends the current swipe. Is called when the mouse button is released.
// Emits an 'input_fired' if the swipe has two or more nodes in it, otherwise it discards the swipe.
function endSwipe() {
	if(swipePath.length > 1 && !swipePath.includes(null)){
      var swipeNodes = [];
      for(node of swipePath){
         swipeNodes.push(node.id);
      }
	console.log("emitting: "+ swipeNodes);
	march.play();
      socket.emit('input_fired', {game:gameId, nodes: swipeNodes});
	} else {
		console.log("swipe failed");
	}
	lines = [];
	swipePath = [];
}

// Server will tell us when a new enemy player connects to the server.
// We create a new enemy in our game.
function onNewPlayer (data) {
	if(data.id == ClientPlayer.id){
		return;
	}
  	console.log("added: " + data.id);
	addNewPlayer(data.id);
}

//This is where we use the socket id.
//Search through players list, and return the player with the id set
function findplayerbyid (id) {
	for (var i = 0; i < players.length; i++) {
		if (players[i].id == id) {
			return players[i];
		}
	}
	return DummyPlayer;
}

//Search through nodes list, and return the node with the id set
function findnodebyid (id) {
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].id == id) {
			return nodes[i];
		}
	}
	return null;
}

//Search through nodes list, and return the node with the id set
function findnodebyloc (x, y) {
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].x == x && nodes[i].y == y) {
			return nodes[i];
		}
	}
	return null;
}

// Called when the map is originated. Creates all the nodes with the data from the server.
function createNodes(data) {
	for (var i = 0; i < data.nodes.length; i++) {
		// Creates a node from the data given and sets the callbacks for the node.
		node_data = data.nodes[i];
      var castle = false;
		if(node_data.buff == 'castle'){
         castle = true;
      }
      let newNode = new MapNode(node_data.id, node_data.x, node_data.y,castle);
		nodeGroup.add(newNode.graphics);
		newNode.graphics.inputEnabled = true;
		newNode.graphics.events.onInputOver.add(mouseOver, {node: newNode});
		// Pushes the node into the node buffer and displays it.
		nodes.push(newNode);
	}

	// Adds all the paths from adjacency lists
	for(var i = 0; i < nodes.length; i++) {
		for(var j = 0; j < data.nodes[i].adj.length; j++) {
			nodeGroup.add(nodes[i].addPath(findnodebyid(data.nodes[i].adj[j])).graphics);
		}
	}

	// Initializes the starting armies through the players
	for(var i = 0; i < data.players.length; i++) {
		var currentPlayer = data.players[i];
		var clientPlayer = addNewPlayer(currentPlayer.id);
		// Goes through all armies the player controls
		for(var j = 0; j < currentPlayer.armies.length; j++) {
			var currentArmy = currentPlayer.armies[j];
			var clientNode = nodes[currentArmy.node];
			// Creates the army in the client and initializes the army's callbacks
			var newArmy = clientPlayer.addArmy(0, currentArmy.id, clientNode.x, clientNode.y);
			armyGroup.add(newArmy.graphics);
			armyGroup.add(newArmy.countGraphics);
			clientNode.graphics.events.onInputDown.forget();
			clientNode.graphics.events.onInputDown.add(swipe, {army: newArmy});
			clientPlayer.updateArmy(currentArmy.count, currentArmy.id, currentArmy.x, currentArmy.y); //Not necessary
		}
	}
	game.camera.setPosition(ClientPlayer.armies[0].x-canvas_width/2, ClientPlayer.armies[0].y-canvas_height/2);
	bannerGFX = game.add.text(game.camera.x ,game.camera.y, "Waiting for players",{
		font: "70px Arial",
		fill: "#FFFFFF",
		align: "center"
	});
	bannerGFXMarker = 'Waiting';
}

// Called every tick
function updateArmies(data){
	var updated = [];
	for(var i = 0; i < nodes.length; i++) {
		updated.push(false);
	}
	for(var i = 0; i < data.players.length; i++) {
		var currentPlayer = data.players[i];
		var currentClientPlayer = findplayerbyid(currentPlayer.id);
		// Goes through every army of every player
		for(var j = 0; j < currentPlayer.armies.length; j++) {
			var currentArmy = currentPlayer.armies[j];
			var clientNode = findnodebyloc(currentArmy.x, currentArmy.y);
			// If the client doesn't have that army, it is created and initialized
			if(currentClientPlayer.getArmyByID(currentArmy.id) == null) {
				var newClientArmy = currentClientPlayer.addArmy(0, currentArmy.id, currentArmy.x, currentArmy.y);
				armyGroup.add(newClientArmy.graphics);
				armyGroup.add(newClientArmy.countGraphics);
			}
			// The army is updated with all relevant values from the server
			currentClientPlayer.updateArmy(currentArmy.count, currentArmy.id, currentArmy.x, currentArmy.y,clientNode);
			// Deletes the old onInputDown and replaces it with the one for the current army.
			// TODO: There is a better way to do this.
			if(clientNode != null) {
				var currentClientArmy = currentClientPlayer.getArmyByID(currentArmy.id);
				clientNode.graphics.events.onInputDown.removeAll();
				clientNode.graphics.events.onInputDown.add(swipe, {army: currentClientArmy});
				updated[clientNode.id] = true;
			}
		}
		for(var j = 0; j < nodes.length; j++) {
			if(!updated[j]) {
				nodes[j].graphics.events.onInputDown.removeAll();
			}
		}
	}
	// Clears any armies that no longer exist in the server.
	// We keep track of this by making the player objects track which armies get updated, and removing the ones that don't.
	for(var j = 0; j < players.length; j++) {
		players[j].removeArmies();
		players[j].clearUpdated();
		players[j].updateArmies(); // Does nothing
	}
}

function startBattle(data) {
   battles.push(new Battle(data.battle));
   console.log('battle starting at x:' + data.battle.x + ' y:' + data.battle.y);
}

function removeBattle(data) {
   for(battle of battles){
      if(battle.x == data.x && battle.y == data.y){
         battle.end();
         battles.splice(battles.indexOf(battle),1);
         return true;
      }
   }
   return false;
}

Main.prototype = {
   create: function () {
      TRASHCODE();
      game.world.setBounds(-canvas_width*20, -canvas_height*20, canvas_width * 40, canvas_height * 40);
      game.add.image(0, 0, 'background_img');
      game.stage.backgroundColor = 0x68c1d1;
      nodeGroup = game.add.group();
      armyGroup = game.add.group();
      game.world.bringToTop(armyGroup);
      game.world.bringToTop(nodeGroup);
      game.input.onUp.add(endSwipe);
      circle = game.add.graphics(0,0);
      volumeButton = createButton(game, null, 'medium', 25, 25, .05, MainMenu, volumeUpdate);
      for(var i = 0; i < 4; i++){
         volumeUpdate();
      }

      leaveButton = createButton(
         game,
         'Return To Main Menu',
         'button1',
         game.camera.x + window.innerWidth,
         game.camera.y + window.innerHeight,
         1,
         Main,
         function(){
            if(gameSocket != null) {
               gameSocket.disconnect();
            }
            socket.disconnect();
            socket = null;
            battle_music.pause();
            game.state.start('MainMenu', true, false, socket);
         },
         0
      );
      leaveButton.text.anchor.setTo(0.5, 0.5);
      console.log("client started");
      socket.emit("client_started",{});
      socket.on('connected', onsocketConnected);
      socket.on('send_nodes', createNodes);
   },

  init: function(sock,button) {
      console.log(button)
      socket = sock;
  },

	update: function () {
		if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
				game.input.keyboard.isDown(Phaser.Keyboard.A))
		{
			game.camera.x -= 10;
		}
		else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
						 game.input.keyboard.isDown(Phaser.Keyboard.D))
		{
			game.camera.x += 10;
		}

		if (game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
				game.input.keyboard.isDown(Phaser.Keyboard.W))
		{
			game.camera.y -= 10;
		}
		else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) ||
						 game.input.keyboard.isDown(Phaser.Keyboard.S))
		{
			game.camera.y += 10;
		}

		leaveButton.x = game.camera.x + window.innerWidth - leaveButton.width;
		leaveButton.text.x = game.camera.x + window.innerWidth - (leaveButton.width / 2);
		leaveButton.y = game.camera.y;
		leaveButton.text.y = game.camera.y + (leaveButton.height / 2);

		if(bannerGFX != null) {
			bannerGFX.x = game.camera.x;
			bannerGFX.y = game.camera.y+canvas_height-100;
		}
                if(volumeButton != null){
                   volumeButton.x = game.camera.x + 50;
                   volumeButton.y = game.camera.y + 50;
                }
	},

	render: function () {
		if(lines.length > 0) {
			lines[lines.length-1].end = new Phaser.Point(game.input.mousePointer.x +game.camera.x, game.input.mousePointer.y+game.camera.y);
			for(var i = 0; i < lines.length; i++) {
                           lines[i].width = 200;
				game.debug.geom(lines[i], '#0000ff');
			}
		}
	}
};
