var socket;
socket = io.connect();

//the enemy player list
var enemies = [];
var nodes = [];
var armies = [];

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
   enemies = data.players.slice();
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
	enemies.splice(enemies.indexOf(removePlayer), 1);
}



function createNodes(data) {
	for (var i = 0; i < data.nodes.length; i++) {
		node_data = data.nodes[i];
		let newNode = new MapNode(i, node_data.x, node_data.y);
		nodes.push(newNode);
		newNode.display(game);
	}
}

function updateArmies(data) {
	for (var i = 0; i < data.armies.length; i++) {
		army_data = data.armies[i];
		let newArmy = new Army(army_data.count, army_data.owner, army_data.node_id);
		armies.push(newArmy);
	}
}

// this is the enemy class.

//Server will tell us when a new enemy player connects to the server.
//We create a new enemy in our game.
function onNewPlayer (data) {
	//enemy object
   console.log("added: "+data.id);
	enemies.push(data.id);
}

//This is where we use the socket id.
//Search through enemies list to find the right enemy of the id.
function findplayerbyid (id) {
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i] == id) {
			return enemies[i];
		}
	}
}
main.prototype = {

	create: function () {
		game.stage.backgroundColor = 0xE1A193;
		console.log("client started");
      socket.emit("client_started",{});
      socket.on('connected', onsocketConnected);
		var testdata =
		{
			nodes: [
				{
					x: 100,
					y: 100,
					adj: [1],
				},
				{
					x: 500,
					y: 500,
					adj: [0],
				},
			]
		};
		createNodes(testdata);
		/*
			get initial positions of nodes.
			data sent:
			{
				{
					int x: xcoord
					int y: ycoord
					int[] adj: list of nodes that can be accessed by this node. Corresponds to index.
				},
				...
			}
			ex. data.nodes[0].x
		*/
		socket.on('send_nodes', createNodes);

		/*
			update army information
			data sent:
			{
				armies{
					int count: new armycount of the node
					player_id owner: who owns the node
					int node_id: id of the node
				},
				...
			}
			ex. data.armies.count
		*/
		socket.on('update_armies', updateArmies);

		//when received remove_player, remove the player passed;
		socket.on('remove_player', onRemovePlayer);
      	socket.on('newPlayer', onNewPlayer)

		//when the player receives the new input
	},

	update: function () {
		// emit the player input
	}
};
