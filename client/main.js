var socket;
//socket = io.connect();
var gameSocket;
//the player list
var players = [];
var ClientPlayer = null;
var DummyPlayer = new Player(null, 0x000000);
players.push(DummyPlayer);

var nodes = [];
var swipePath = [];
var gameId;
var lines = [];
// Used for image heirarchy in phaser
var nodeGroup = null;
var armyGroup = null;

var colors = [0xFF0000,	0xFF9F00, 0xF8FF00, 0x7AFF00,0x0000FF,
										 0x8900FF, 0xFF00F6, 0x097B00, 0x980842];
var colorTaken = [false, false, false, false, false,
									false, false, false, false];
var bannerGFX;
//var leaveButton;

var main = function(game){
};

// ONLY CALL IF YOU WANT TO DESTROY ALL OBJECTS IN MAIN
function removeAll() {
	if(bannerGFX != null)
		bannerGFX.destroy();

	// Removes all lines? Is this even necessary?
	lines = [];
	// Removes all Nodes and Paths
	for(var i = 0; i < nodes.length; i++) {
		for(var j = 0; j < nodes[i].paths.length; j++) {
			if(nodes[i].paths[j].graphics != null) {
				nodes[i].paths[j].graphics.destroy();
			}
		}
		if(nodes[i].graphics != null) {
			nodes[i].graphics.destroy();
		}
	}
	// Removes all players and armies
	if(players != null) {
		for(var i = 0; i < players.length; i++) {
			for(var j = 0; j < players[i].armies.length; j++) {
				players[i].armies[j].destroyGraphics();
			}
		}
	}
	/*
	if(leaveButton != null)
		leaveButton.destroy();
		*/
	players = [];
	ClientPlayer = null;
	DummyPlayer = new Player(-1, 0x000000);
	players.push(DummyPlayer);
}

function onsocketConnected (data) {
	console.log("connected to server");
	console.log(this.id + " " + data.id);
	gameId = data.game
	console.log(gameId);
	gameSocket = io(gameId);

	gameSocket.on('update_armies', updateArmies);
	gameSocket.on('remove_player', onRemovePlayer);
	gameSocket.on('endGame',endGame);
	gameSocket.on('newPlayer', onNewPlayer);
	gameSocket.on('updateTime', onUpdateTime);
	gameSocket.on('startGame',onStart);

	ClientPlayer = addNewPlayer(this.id);
	for(var i = 0; i < data.players.length; i++) {
		if(data.players[i].id !=  this.id){
			addNewPlayer(data.players[i].id);
		}
	}
	// send the server our initial position and tell it we are connected
}
function onStart(){
		bannerGFX.destroy();
		bannerGFX= game.add.text(game.camera.x,game.camera.y, "Fight!",{
			font: "70px Arial",
			fill: "#FFFFFF",
			align: "center"
		  });
		setTimeout(function(){bannerGFX.destroy();}, 5000);
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
}
function displayWin(){
	bannerGFX.destroy();
	bannerGFX= game.add.text(game.camera.x,game.camera.y, "Winner!",{
		font: "70px Arial",
		fill: "#FFFFFF",
		align: "center"
	  });
}
// When the server notifies us of client disconnection, we find the disconnected
// enemy and remove from our game
function onRemovePlayer (data) {
	if (!removePlayer(data.id)) {
		console.log('Player not found: ', data.id)
	}
}

// Removes the player from the players list and opens their color up for reassignment
function removePlayer(id) {
	if(!id) {
		return false;
	}
	for(var i = 0; i < players.length; i++) {
		if(players[i].id == id) {
			clearColor(players[i].color);
			players.splice(i, 1);
			return true;
		}
	}
	return false;
}

// Adds a new player to the player list with the given id. Also gets a color from getColor.
function addNewPlayer(id) {
	if(id == null) {
		return DummyPlayer;
	}
	var newPlayer = findplayerbyid(id);
	if(newPlayer.id != DummyPlayer.id) {
		return newPlayer;
	}
	var color;
	if(id == socket.id){
		color =  0x00B2EE;
	}else{
		color = getColor();
	}
	let player = new Player(id, color);
	players.push(player);
	return player;
}

// Called when a player exits. Allows their color to be used again.
function clearColor(color) {
	for(var i = 0; i < colors.length; i++) {
		if(color == colors[i]) {
			colorTaken[i] = false;
		}
	}
}

// Returns a color from the colors list, so long as it isn't taken.
// If all colors are taken, it will return a black color.
function getColor() {
	var index = Math.floor(Math.random() * colors.length);
	var loopBreaker = 0;
	// Will iterate through all colours in the list. If none are available, you're gonna be black
	while(colorTaken[index]) {
		index++;
		loopBreaker++;
		if(loopBreaker > colors.length) {
			return 0x000000;
		}
	}
	colorTaken[index] = true;
	return colors[index];
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
	console.log("Mouse is over node " + this.node.x + ", " + this.node.y);
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
	if(swipePath.length > 1) {
    var swipeNodes = [];
    for(node of swipePath){
      swipeNodes.push(node.id);
    }
		console.log("emitting: "+ swipeNodes);
		socket.emit('input_fired', {game:gameId, nodes: swipeNodes});
	}
	else {
		if(swipePath.length == 1) {
			console.log("swipe failed");
		}
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
		let newNode = new MapNode(node_data.id, node_data.x, node_data.y);
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
			console.log("Adding client " + clientPlayer.id + " army");
			var newArmy = clientPlayer.addArmy(0, currentArmy.id, clientNode.x, clientNode.y);
			console.log(clientPlayer.id + " now has " + clientPlayer.armies.length + " armies");
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
			currentClientPlayer.updateArmy(currentArmy.count, currentArmy.id, currentArmy.x, currentArmy.y);
			// Deletes the old onInputDown and replaces it with the one for the current army.
			// TODO: There is a better way to do this.
			if(clientNode != null) {
				var currentClientArmy = currentClientPlayer.getArmyByID(currentArmy.id);
				clientNode.graphics.events.onInputDown.forget();
				clientNode.graphics.events.onInputDown.add(swipe, {army: currentClientArmy});
				updated[clientNode.id] = true;
			}
		}
		for(var j = 0; j < nodes.length; j++) {
			if(!updated) {
				nodes[j].graphics.events.onInputDown.forget();
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

main.prototype = {
	create: function () {
		game.world.setBounds(-canvas_width*2, -canvas_height*2, canvas_width * 4, canvas_height * 4);
		game.stage.backgroundColor = 0x000000;
		nodeGroup = game.add.group();
		armyGroup = game.add.group();
		game.world.bringToTop(armyGroup);
		game.input.onUp.add(endSwipe);
/*
		leaveButton = game.add.button(game.camera.x + window.innerWidth, game.camera.y + window.innerHeight, 'button1', function() {
			if(gameSocket != null) {
				gameSocket.disconnect();
			}
			socket.disconnect();
			removeAll();
			game.state.start('mainmenu', true, false, socket);
		}, main, 2, 1, 0);
		leaveButton.anchor.setTo(0.0, 0.0);
		leaveButton.text = game.add.text(leaveButton.x, leaveButton.y, "Return to Main Menu", {
			font: "14px Arial",
			fill: "#fff",
			align: "center"
		});
		leaveButton.text.anchor.setTo(0.5, 0.5);
		*/

		console.log("client started");
    socket.emit("client_started",{});
		socket.on('connected', onsocketConnected);
		socket.on('send_nodes', createNodes);
	},

  init: function(sock) {
      socket = sock;
  },

	update: function () {
		if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
				game.input.keyboard.isDown(Phaser.Keyboard.A))
		{
			game.camera.x -= 4;
		}
		else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
						 game.input.keyboard.isDown(Phaser.Keyboard.D))
		{
			game.camera.x += 4;
		}

		if (game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
				game.input.keyboard.isDown(Phaser.Keyboard.W))
		{
			game.camera.y -= 4;
		}
		else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) ||
						 game.input.keyboard.isDown(Phaser.Keyboard.S))
		{
			game.camera.y += 4;
		}
/*
		leaveButton.x = game.camera.x + window.innerWidth - leaveButton.width;
		leaveButton.text.x = game.camera.x + window.innerWidth - (leaveButton.width / 2);
		leaveButton.y = game.camera.y;
		leaveButton.text.y = game.camera.y + (leaveButton.height / 2);
		*/
		// emit the player input
	},

	render: function () {
		if(lines.length > 0) {
			lines[lines.length-1].end = new Phaser.Point(game.input.mousePointer.x +game.camera.x, game.input.mousePointer.y+game.camera.y);
			for(var i = 0; i < lines.length; i++) {
				game.debug.geom(lines[i], 0x000000);
			}
		}
	}
};
