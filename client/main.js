var socket;
socket = io.connect();

//the player list
var ClientPlayer = null;
var players = [];
var nodes = [];
var armies = [];
var swipePath = [];
var colors = ["#C0C0C0",	"#808080", "#000000",
							"#FF0000", "#800000", "#FFFF00", "#808000",
							"#00FF00", "#008000", "#00FFFF", "#008080",
							"#0000FF", "#000080", "#FF00FF", "#800080"];
var colorTaken = [false, false, false,
									false, false, false, false,
									false, false, false, false,
									false, false, false, false];
var gameProperties = {
	gameWidth: 4000,
	gameHeight: 4000,
	game_element: "gameDiv",
	in_game: false,
};

var main = function(game){
};

function onsocketConnected (data) {
	console.log("connected to server");
  console.log(this.id + " " + data.id);
	ClientPlayer = addNewPlayer(this.id);
	for(var i = 0; i < data.players.length; i++) {
		addNewPlayer(data.players[i]);
	}
	gameProperties.in_game = true;
	// send the server our initial position and tell it we are connected
}

// When the server notifies us of client disconnection, we find the disconnected
// enemy and remove from our game
function onRemovePlayer (data) {
	if (!removePlayer(data.id)) {
		console.log('Player not found: ', data.id)
	}
}

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
		return;
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
	while(colorTaken[index]) {
		index++;
		loopbreaker++;
		if(loopbreaker > colors.length) {
			return "#000000";
		}
	}
	return colors[index];
}

// Called when a user clicks on a node.
function swipe(node) {
	// If the node has no owner or if the node isn't owned by this client, do nothing.
	if(node.owner == null || node.owner.id != ClientPlayer.id) {
		console.log("That's not your node!");
	}
	else {
		swipePath.push(node);
	}
}

// Called when the mouse hovers over the node passed in the parameter.
// Adds the node to the swipePath if a swipe was initialized.
function mouseOver(node) {
	console.log("Mouse is over node " + node.id);
	if(swipePath.length != 0) {
		if(validNode(swipePath[swipePath.length-1], node)) {
			swipePath.push(node);
			console.log("Added node " + node.id);
		}
		else {
			console.log(node.id + " not a valid node");
		}
	}
}

// Ends the current swipe. Is called when the mouse button is released.
// Emits and 'input_fired' if the swipe has two or more nodes in it, otherwise it discards the swipe.
function endSwipe() {
	console.log("Reached endSwipe");
	if(swipePath.length > 1) {
		console.log("Swiped from " + swipePath[0].id + " to ")
		for(var i = 1; i < swipePath.length; i++) {
			console.log(" " + swipePath[i].id);
		}
		console.log("emitting: ["+swipePath[0] +", "+swipePath[1]+"]");
		socket.emit('input_fired', {nodes: [swipePath[0].id, swipePath[1].id]});
	}
	else {
		console.log("swipe failed");
	}
	swipePath = [];
}

// Checks to see if node2 is on node1's adjacency list.
function validNode(node1, node2) {
	for(var i = 0; i < node1.adj.length; i++) {
		if(node1.adj[i].id = node2.id) {
			return true;
		}
	}
	return false;
}

//Server will tell us when a new enemy player connects to the server.
//We create a new enemy in our game.
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
	return null;
}

// Called when the map is originated. Creates all the nodes with the data from the server.
function createNodes(data) {
	for (var i = 0; i < data.nodes.length; i++) {
		// Creates a node from the data given and sets the callbacks for the node.
		node_data = data.nodes[i];
		let newNode = new MapNode(i, node_data.x, node_data.y, node_data.adj, game.add.sprite(node_data.x, node_data.y, 'node_img'));
		newNode.graphics.inputEnabled = true;
		newNode.graphics.events.onInputDown.add(function(){swipe(newNode)});
		newNode.graphics.events.onInputOver.add(function(){mouseOver(newNode)});
		newNode.graphics.events.onInputUp.add(function(){endSwipe()});

		// Pushes the node into the node buffer and displays it.
		nodes.push(newNode);
		newNode.display(game);
	}

	// Iterates through all castles in the node list.
	for(var i = 0; i < data.castles.length; i++){
		var included = false;
		var player;
		// Checks the client player list to see if it contains the army owner specified in the data.
		for(var j = 0; j < players.length; j++) {
			if(data.nodes[data.castles[i]].army.player == players[j].id) {
				included = true;
				player = players[j];
			}
		}
		// If no such player exists, it creates the player and pushes it to the list.
		if(!included) {
			player = addNewPlayer(data.nodes[data.castles[i]].army.player);
		}

		// Updates the army counts and the new owners of the castles.
		nodes[data.castles[i]].updateArmy(data.nodes[data.castles[i]].army);
		nodes[data.castles[i]].owner = player;
	}
}

function updateNodes(data){
	var sentNodes = data.nodes;
	// for every node in our client
	for(var i = 0; i < nodes.length; i++){
		// If the sent node has an army, update it.
		if(sentNodes[i].army){
			var currentArmy = sentNodes[i].army;
			// If our nodes didn't hold an army, initialize that node's army
			if(!nodes[i].army){
				nodes[i].army = new Army(0,0,i)
			}
			// Update our clients army variables
			nodes[i].army.count = currentArmy.count;
			nodes[i].army.player = currentArmy.player;
			nodes[i].owner = findplayerbyid(currentArmy.player);
		}else{
			nodes[i].army = null;
			nodes[i].owner = null;
		}
		// Update the node with the new values passed to it.
		nodes[i].update();
	}
}

main.prototype = {

	create: function () {
		game.stage.backgroundColor = 0xE1A193;
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
					data.nodes[data.castles[0]].army.id
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
	}
};
