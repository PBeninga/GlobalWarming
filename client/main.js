var socket;
socket = io.connect();

//the player list
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
   	console.log(this.id+" "+data.id)
   	players = data.players.slice();
	gameProperties.in_game = true;
	// send the server our initial position and tell it we are connected
}

// When the server notifies us of client disconnection, we find the disconnected
// enemy and remove from our game
function onRemovePlayer (data) {
	var removePlayer = findplayerbyid(data.id);
	// Player not found
	if (!removePlayer) {
		console.log('Player not found: ', data.id)
		return;
	}
	players.splice(players.indexOf(removePlayer), 1);
}



function createNodes(data) {
	for (var i = 0; i < data.nodes.length; i++) {
		node_data = data.nodes[i];
		let newNode = new MapNode(i, node_data.x, node_data.y, node_data.adj, game.add.sprite(node_data.x, node_data.y, 'node_img'));
		newNode.graphics.inputEnabled = true;
		newNode.graphics.events.onInputDown.add(function(){swipe(newNode)});
		newNode.graphics.events.onInputOver.add(function(){mouseOver(newNode)});
		newNode.graphics.events.onInputUp.add(function(){endSwipe()});
		nodes.push(newNode);
		newNode.display(game);
	}
	for(var i = 0; i < data.castles.length; i++){
		var included = false;
		var player;
		for(var j = 0; j < players.length; j++) {
			if(data.nodes[data.castles[i]].army.player == players[j].id) {
				included = true;
				player = players[j];
			}
		}
		if(!included) {
			player = addNewPlayer(data.nodes[data.castles[i]].army.player);
		}
		nodes[data.castles[i]].updateArmy(data.nodes[data.castles[i]].army);
		nodes[data.castles[i]].owner = player;
	}
}

function addNewPlayer(id) {
	player = new Player(id, getColor());
	players.push(player);
	return player;
}

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

function swipe(node) {
	console.log("Reached Swipe");
	swipePath.push(node);
}



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

function endSwipe() {
	console.log("Reached endSwipe");
	if(swipePath.length > 1) {
		console.log("Swiped from " + swipePath[0].id + " to ")
		for(var i = 1; i < swipePath.length; i++) {
			console.log(" " + swipePath[i].id);
		}
		socket.emit('input_fired', {nodes: [swipePath[0], swipePath[1]]});
	}
	else {
		console.log("swipe failed");
	}
	swipePath = [];
}

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
	//enemy object
  console.log("added: "+data.id);
	addNewPlayer(data.id);
}

//This is where we use the socket id.
//Search through players list to find the right enemy of the id.
function findplayerbyid (id) {
	for (var i = 0; i < players.length; i++) {
		if (players[i] == id) {
			return players[i];
		}
	}
}

function updateNodes(data){
	for(var i = 0; i < nodes.length; i++){//manually do all changes that could happen;
		if(nodes[i].army){
			nodes[i].army.count = data.nodes[i].army.count;
		}
		nodes[i].update();
	}
}

main.prototype = {

	create: function () {
		game.stage.backgroundColor = 0xE1A193;
		console.log("client started");
    socket.emit("client_started",{});
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
		socket.on('update_nodes', updateNodes);
		//when received remove_player, remove the player passed;
		socket.on('remove_player', onRemovePlayer);
      	socket.on('newPlayer', onNewPlayer)

		//when the player receives the new input
	},

	update: function () {
		// emit the player input
	}
};
