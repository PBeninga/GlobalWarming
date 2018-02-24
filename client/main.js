var socket;
socket = io.connect();

//the player list
var players = [];
var ClientPlayer = null;
var DummyPlayer = new Player(-1, 0x000000);
players.push(DummyPlayer);

var nodes = [];
var swipePath = [];
var lines = [];

var colors = [0xFF0000,	0xFF9F00, 0xF8FF00, 0x7AFF00, 0x00FFFF,
							0x0000FF, 0x8900FF, 0xFF00F6, 0x097B00, 0x980842];
var colorTaken = [false, false, false, false, false,
									false, false, false, false, false];

var main = function(game){
};

function onsocketConnected (data) {
	console.log("connected to server");
  console.log(this.id + " " + data.id);
	ClientPlayer = addNewPlayer(this.id);
	for(var i = 0; i < data.players.length; i++) {
		addNewPlayer(data.players[i]);
	}
	// send the server our initial position and tell it we are connected
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
	player = new Player(id, getColor());
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
		console.log("That's not your army! Army at " + this.army.node.id + " is owned by " + this.army.owner.id);
	}
	else {
		console.log("Army at " + this.army.node.id + " is owned by " + this.army.owner.id);
		swipePath.push(this.army.node);
		lines.push(new Phaser.Line(this.army.node.x, this.army.node.y, game.input.mousePointer.x, game.input.mousePointer.y));
	}
}

// Called when the mouse hovers over the node passed in the parameter.
// Adds the node to the swipePath if a swipe was initialized.
function mouseOver(node) {
	console.log("Mouse is over node " + node.id);
	if(swipePath.length != 0) {
		if(swipePath[swipePath.length-1].pathTo(node)) {
			swipePath.push(node);
			lines[lines.length-1].end = new Phaser.Point(node.x, node.y);
			lines.push(new Phaser.Line(node.x, node.y, game.input.mousePointer.x, game.input.mousePointer.y));
		}
		else {
		}
	}
}

// Ends the current swipe. Is called when the mouse button is released.
// Emits an 'input_fired' if the swipe has two or more nodes in it, otherwise it discards the swipe.
function endSwipe() {
	if(swipePath.length > 1) {
		console.log("emitting: ["+swipePath[0].id +", "+swipePath[1].id+"]");
		socket.emit('input_fired', {nodes: [swipePath[0].id, swipePath[1].id]});
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

// Called when the map is originated. Creates all the nodes with the data from the server.
function createNodes(data) {
	for (var i = 0; i < data.nodes.length; i++) {
		// Creates a node from the data given and sets the callbacks for the node.
		node_data = data.nodes[i];
		let newNode = new MapNode(i, node_data.x, node_data.y);
		newNode.graphics.inputEnabled = true;
		newNode.graphics.events.onInputOver.add(function(){mouseOver(newNode)});
		// Pushes the node into the node buffer and displays it.
		nodes.push(newNode);
	}

	// Adds all the paths from adjacency lists
	for(var i = 0; i < nodes.length; i++) {
		for(var j = 0; j < data.nodes[i].adj.length; j++) {
			nodes[i].addPath(findnodebyid(data.nodes[i].adj[j]));
		}
	}

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

		// Updates the army counts and the new owners of the castles.
		var newArmy = player.addArmy(currentArmy.count, nodes[castlePosition]);
		newArmy.graphics.events.onInputDown.add(swipe, {army: newArmy});
	}
}

function updateNodes(data){
	var sentNodes = data.nodes;
	for(var i = 0; i < sentNodes.length; i++){
		// If the sent node has an army, update it.
		if(sentNodes[i].army){
			var currentArmy = sentNodes[i].army;
			// If our nodes didn't hold an army, initialize that node's army
			playerOwner = findplayerbyid(currentArmy.player);
			if(playerOwner.getArmyId(nodes[i].x, nodes[i].y) == -1) {
				var newArmy = playerOwner.addArmy(0, nodes[i]);
				newArmy.graphics.events.onInputDown.add(swipe, {army: newArmy});
			}
			// Update our clients army variables
			playerOwner.updateArmy(currentArmy.count, nodes[i]);
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
		game.stage.backgroundColor = 0xE1A193;
		game.input.onUp.add(endSwipe);
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
						location: Where the army is located (currently x, y)
					]
				]
			}
			ex. data.nodes[0].adj[0]
					data.players[0].armies[0].location.x
		*/
		socket.on('send_nodes', createNodes);

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

			CHANGE TO:
			{
				players[
					id: Player ID
					armies[
						count: Strength of the army
						location:	Where the army is located (currently x, y)
					]
				]
			}
			ex. data.players.armies[0].location.x
		*/
		socket.on('update_nodes', updateNodes);

		/*
			Sends the id of a player which has left the game
			data sent:
			{
				id: ID of the player which has left.
			}
			ex. data.id
		*/
		socket.on('remove_player', onRemovePlayer);

    socket.on('newPlayer', onNewPlayer)

		//when the player receives the new input
	},

	update: function () {
		// emit the player input
	},

	render: function () {
		if(lines.length > 0) {
			lines[lines.length-1].end = new Phaser.Point(game.input.mousePointer.x, game.input.mousePointer.y);
			for(var i = 0; i < lines.length; i++) {
				game.debug.geom(lines[i], 0x000000);
			}
		}
	}
};
