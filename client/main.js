var socket;
//socket = io.connect();
var gameSocket;
//the player list
var players = [];
var ClientPlayer = null;
var DummyPlayer = new Player(-1, 0x000000);
players.push(DummyPlayer);

var nodes = [];
var swipePath = [];
var gameId;
var lines = [];

var colors = [0xFF0000,	0xFF9F00, 0xF8FF00, 0x7AFF00,0x0000FF,
										 0x8900FF, 0xFF00F6, 0x097B00, 0x980842];
var colorTaken = [false, false, false, false, false,
									false, false, false, false];
var bannerGFX;
var leaveButton;

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
	if(leaveButton != null)
		leaveButton.destroy();
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
		/*
			Sends the data we will need to update the game, which is the armies and the owners.
			data sent:
			{
				nodes[
					army: Variable holding the army values.
						count: Strength of the army.
						player: ID of the player that owns it.
				]
			}
			ex. data.nodes[0].army.count
		*/
		gameSocket.on('update_nodes', updateNodes);

		/*
			Sends the id of a player which has left the game
			data sent:
			{
				id: ID of the player which has left.
			}
			ex. data.id
		*/
		gameSocket.on('remove_player', onRemovePlayer);
		/* data  =
		{
			winner: the id of the winner of the game
		}
		*/
		gameSocket.on('endGame',endGame);
		/*
		data =
		{
			id: new player id
		}
		*/
		gameSocket.on('newPlayer', onNewPlayer);
		/*data =
		 {
			time: time left untill game starts
		 }
		*/
		gameSocket.on('updateTime', onUpdateTime);
		gameSocket.on('startGame',onStart);
		gameSocket.on('move_armies', moveArmies);

		//when the player receives the new input
	ClientPlayer = addNewPlayer(this.id);
	for(var i = 0; i < data.players.length; i++) {
		if(data.players[i] !=  this.id){
			addNewPlayer(data.players[i]);
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
	var color;
	if(id == socket.id){
		color =  0x00B2EE;
	}else{
		color = getColor();
	}
	player = new Player(id, color);
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
	else {
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
		if(swipePath[swipePath.length-1].pathTo(this.node) != null) {
			swipePath.push(this.node);
			lines[lines.length-1].end = new Phaser.Point(this.node.x, this.node.y);
			lines.push(new Phaser.Line(this.node.x, this.node.y, game.input.mousePointer.x + game.camera.x, game.input.mousePointer.y+ game.camera.y));
		}
		else {
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
	console.log("Failure to find node id " + id);
	return null;
}

//Search through nodes list, and return the node with the id set
function findnodebyloc (x, y) {
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].x == x && nodes[i].y == y) {
			return nodes[i];
		}
	}
	console.log("Failure to find node id " + id);
	return null;
}

// Called when the map is originated. Creates all the nodes with the data from the server.
function createNodes(data) {
	for (var i = 0; i < data.nodes.length; i++) {
		// Creates a node from the data given and sets the callbacks for the node.
		node_data = data.nodes[i];
		let newNode = new MapNode(i, node_data.x, node_data.y);
		newNode.graphics.inputEnabled = true;
		newNode.graphics.events.onInputOver.add(mouseOver, {node: newNode});
		// Pushes the node into the node buffer and displays it.
		nodes.push(newNode);
	}

	// Adds all the paths from adjacency lists
	for(var i = 0; i < nodes.length; i++) {
		for(var j = 0; j < data.nodes[i].adj.length; j++) {
			nodes[i].addPath(findnodebyid(data.nodes[i].adj[j]));
		}
	}

// TODO: REPLACE EVERYTHING BELOW THIS ONCE DATA GETS RESTRUCTURED
/*
	for(var i = 0; i < data.players.length; i++) {
		var player = addNewPlayer(daya.players[i].id);
		for(var j = 0; j < data.players[i].armies.length; j++) {
			var newArmy = player.addArmy(data.players[i].armies[j].count, nodes[data.players[i].armies[j].location]);
			newArmy.graphics.events.onInputDown.add(swipe, {army: newArmy});
			newArmy.graphics.events.onInputOver.add(mouseOver, {node: newArmy.node});
		}
	}
*/

	// Iterates through all castles in the node list.
	for(var i = 0; i < data.castles.length; i++){
		var castlePosition = data.castles[i];
		var currentArmy = data.nodes[castlePosition].army;
		var included = false;
		var player;
		// Checks the client player list to see if it contains the army owner specified in the data.
		for(var j = 0; j < players.length; j++) {
			if(currentArmy.player == players[j].id) {
				included = true;
				player = players[j];
				break;
			}
		}
		// If no such player exists, it creates the player and pushes it to the list.
		if(!included) {
			player = addNewPlayer(currentArmy.player);
		}
		if(currentArmy.player){
			console.log("HERHEHRHEHE" + currentArmy.player + " " + ClientPlayer.id);
		}
		if(currentArmy.player == ClientPlayer.id){
			game.camera.setPosition(data.nodes[castlePosition].x-canvas_width/2, data.nodes[castlePosition].y-canvas_height/2);
			bannerGFX = game.add.text(game.camera.x ,game.camera.y, "Waiting for players",{
				font: "70px Arial",
				fill: "#FFFFFF",
				align: "center"
			  });
		}

		// Updates the army counts and the new owners of the castles.
		var newArmy = player.addArmy(currentArmy.count, nodes[castlePosition].x, nodes[castlePosition].y);
		newArmy.graphics.events.onInputDown.add(swipe, {army: newArmy});
		newArmy.graphics.events.onInputOver.add(mouseOver, {node: nodes[castlePosition]});
	}
}

function moveArmies(data) {
	//console.log("moveArmies");
	for(var i = 0; i < data.moving.length; i++) {
		startNode = findnodebyid(data.moving[i].nodes[0]);
		currentPath = startNode.pathTo(findnodebyid(data.moving[i].nodes[1]));
		sentArmy = data.moving[i].army;
		currentPlayer = findplayerbyid(data.moving[i].army.player);
		currentPlayer.addArmy(sentArmy.count,
			currentPath.percentToX(data.moving[i].percentage /100),
			currentPath.percentToY(data.moving[i].percentage/100));
	}
}

function updateNodes(data){
	//TODO: REPLACE EVERYTHING BELOW THIS WHEN DATA GETS RESTRUCTURED
/*
	for(var i = 0; i < data.players.length; i++) {
		var currentPlayer = findplayerbyid(data.players[i].id);
		for(var j = 0; j < data.players[i].armies.length; j++) {
			currentArmy = data.players[i].armies[j];
			if(currentArmy.id >= currentPlayer.armies.length) {
				var newArmy = currentPlayer.addArmy(0, nodes[currentArmy.location]);
				newArmy.graphics.events.onInputDown.add(swipe, {army: newArmy});
				newArmy.graphics.events.onInputOver.add(mouseOver, {node: newArmy.node});
			}
			playerOwner.updateArmy(currentArmy.count, nodes[i]);
		}
	}
	for(var j = 0; j < players.length; j++) {
		players[j].removeArmies();
		players[j].clearUpdated();
		players[j].updateArmies();
	}
*/

	var sentNodes = data.nodes;
	for(var i = 0; i < sentNodes.length; i++){
		// If the sent node has an army, update it.
		if(sentNodes[i].army){
			var currentArmy = sentNodes[i].army;
			// If our nodes didn't hold an army, initialize that node's army
			playerOwner = findplayerbyid(currentArmy.player);
			if(playerOwner.getArmyId(nodes[i].x, nodes[i].y) == -1) {
				var newArmy = playerOwner.addArmy(0, nodes[i].x, nodes[i].y);
				newArmy.graphics.events.onInputDown.add(swipe, {army: newArmy});
				newArmy.graphics.events.onInputOver.add(mouseOver, {node: nodes[i]});
			}
			// Update our clients army variables
			playerOwner.updateArmy(currentArmy.count, nodes[i].x, nodes[i].y);
		}

	}
	for(var j = 0; j < players.length; j++) {
		players[j].removeArmies();
		players[j].clearUpdated();
		players[j].updateArmies();
	}
}

/*
// Prints data passed to createnode
function printCreateNodeData(data) {
	for(var i = 0; i < data.nodes.length; i++) {
		console.log("node " + i + ": {");
		console.log("	x: " + data.nodes[i].x +  ", y: " + data.nodes[i].y);
		var adj = "	adj:{";
		for(var j = 0; j < data.nodes[i].adj.length - 1; j++) {
			adj += data.nodes[i].adj[j] + ",";
		}
		console.log(adj + data.nodes[i].adj[data.nodes[i].adj.length - 1] + "}");
		if(data.castles.includes(i)) {
			console.log("	army: {");
			console.log("		player: " + data.nodes[i].army.player);
			console.log("		count: " + data.nodes[i].army.count);
		}
	}
}
*/

main.prototype = {

	create: function () {
		game.world.setBounds(-canvas_width*2, -canvas_height*2, canvas_width * 4, canvas_height * 4);
		game.stage.backgroundColor = 0x000000;
		game.input.onUp.add(endSwipe);

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

		console.log("client started");
    	socket.emit("client_started",{});

		/*
			sends the initial player data
			data sent:
			{
				id: The id automatically generated for the player.
				players[]: The ids of the players that are already in the game
			}
			ex. data.id -> Your player id.
			ex. data.players[0] -> Other player ids
		*/
		socket.on('connected', onsocketConnected);
		/*
			get initial positions of nodes.
			data sent:
			{
				nodes[
					int x: xcoord
					int y: ycoord
					int[] adj: list of nodes that can be accessed by this node. Corresponds to index.
					(optional)army army:
					 	player: id of the player owning the army
						count: amount of the army
				]
				castles[]: index of where the optional armies lie
			}
			ex. data.nodes[0].x
					data.nodes[data.castles[0]].army.player

			CHANGE TO
			{
				nodes[
					x: xcoord
					y: ycoord
					adj[]: list of node ids that can be accessed by this node
				]
				players[
					id: Player ID
					armies[
						count: Strength of the army
						location: Where the army is located (index of node)
					]
				]
			}
			ex. data.nodes[0].adj[0]
					data.players[0].armies[0].location.x
		*/
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

		leaveButton.x = game.camera.x + window.innerWidth - leaveButton.width;
		leaveButton.text.x = game.camera.x + window.innerWidth - (leaveButton.width / 2);
		leaveButton.y = game.camera.y;
		leaveButton.text.y = game.camera.y + (leaveButton.height / 2);
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
