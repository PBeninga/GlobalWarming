//GRID
var block_size = 20; //calculated based GRID_DIM and grid_h/w
const GRID_DIM = 50;   //SET dimension of grid in number of blocks
var grid_height = 500; //in pixels
var grid_width = 500;  //in pixels

//COLORS
const GREY ="#B8B8B8";
const RED = "#FF0A0A";
const BLACK="#000000";
const TAN = "#D2B48C";

//STATES
const SELECT_STATE=10;
const NODE_STATE=11;
const CASTLE_STATE=12;
const PATH_STATE=13;

//current state data
var selected_block = {x:"-1",y:"-1"};
var state=10;

//Map Data
var nodes = [];
var castles = [];
var paths = [];

//BUTTONS
var select_button = document.getElementById("select");
var node_button = document.getElementById("node");
var castle_button = document.getElementById("castle");
var path_button = document.getElementById("path");
var export_button = document.getElementById("export");

//path variable
var prev_node =-1;

//TODO TODO
// check for existence of a node or castle before creating one
// enable select for objects
// add the ability to post and save JSON for map
// add associations between nodes

///////////////////////////////////////////////////////////////////////////////
// Listeners

document.addEventListener("click", function () {
    
    var canvas = document.getElementById('grid');
    var rect = canvas.getBoundingClientRect();

    // some fancy math to get x and y in terms of the grid, not the page
    selected_block.x = parseInt((event.clientX - rect.left) / block_size);
    selected_block.y = parseInt((event.clientY - rect.top) / block_size);
   
    // if the click is not inside of the canvas
    if( selected_block.x < 0 || selected_block.x > GRID_DIM ||
        selected_block.y < 0 || selected_block.y > GRID_DIM){
        return;
    }

    //Handles the click by mode
    switch(state) {
        case SELECT_STATE:
            select();
            break;
        case NODE_STATE:
            place_node();
            break;
        case CASTLE_STATE:
            place_castle();
            break;
        case PATH_STATE:
            place_path();
            break;
        default:
            state=SELECT_STATE;
            select();
    }
    
    draw();
});

//Button listeners
// update state based on button pressed

select_button.addEventListener("click", function(){
    state=SELECT_STATE;
});

node_button.addEventListener("click", function(){
    state=NODE_STATE; 
});

castle_button.addEventListener("click", function(){
    state=CASTLE_STATE;
});

path_button.addEventListener("click", function(){
    state=PATH_STATE; 
});
    
export_button.addEventListener("click", function(){
    export_map_payload(); 
});


///////////////////////////////////////////////////////////////////////////////
// Click functions based on mode

function select(){
   
}

function place_node(){
    var n = {
        x:selected_block.x,
        y:selected_block.y,
        adj:[],
        paths:[]
    } 
    nodes.push(n);   
}

//creates a node at the given location then references it as a castle
function place_castle(){
    place_node();
    castles.push(nodes.length-1);
}

function place_path(){
   
    var index = node_check();
   
    // checks to see if a node was clicked
    if(index==-1)
        return;
    
    if(prev_node==-1){
        // if there isn't a prev node, set it
        prev_node=index;
        return;
    }
    else {
        //create a path object using prev node
        var p = {
           end_points:[] 
        }
        
        p.end_points.push(prev_node);
        p.end_points.push(index);
        //push the path obj and set previous to -1
        paths.push(p);
        prev_node=-1;
    }
}

//returns the index of the selected block in the node list. -1 if nonexistant
function node_check(){
    for( var i = 0; i < nodes.length; i++ ){
        if( nodes[i].x == selected_block.x && nodes[i].y == selected_block.y )
            return i;
    }
    return -1;
}

///////////////////////////////////////////////////////////////////////////////
// Draw stuff

function draw(){  
    document.body.style.backgroundColor = GREY;
    
    var canvas = document.getElementById('grid');
    var g = canvas.getContext('2d');
   
    g.clearRect(0,0,grid_width,grid_height);
    draw_grid(g);
    draw_selected_block(g);
    draw_paths(g);
    draw_nodes(g);
    draw_castles(g);
}

function draw_grid(g){
    
    g.strokeStyle=BLACK;
    g.lineWidth=.5;
    
    for( var x = 0; x<grid_width; x+=block_size ){
        for( var y = 0; y<grid_height; y+= block_size ){
            g.strokeRect(x,y,block_size,block_size);
        }
    }
    
}

function draw_selected_block(g){
    if(selected_block.x >= 0 && selected_block.y >= 0 ){
        var xCoord = selected_block.x * block_size;
        var yCoord = selected_block.y * block_size;
   
        g.lineWidth=4;
        g.strokeStyle=RED;
        g.strokeRect(xCoord, yCoord, block_size, block_size);    
    }
}

function draw_nodes(g){
    g.fillStyle=TAN;
    for( var i = 0; i<nodes.length; i++){
       g.fillRect(nodes[i].x*block_size, nodes[i].y*block_size, block_size, block_size);
    } 
}


function draw_castles(g){
    g.fillStyle=BLACK;
    for( var i=0; i<castles.length; i++){
        var temp = nodes[castles[i]];
        g.fillRect(temp.x*block_size, temp.y*block_size, block_size, block_size);
    }
}

function draw_paths(g){
    for(var i = 0; i < paths.length; i ++ ){
        var n0 = nodes[paths[i].end_points[0]];
        var n1 = nodes[paths[i].end_points[1]];
        g.strokeStyle=RED;
        
        g.moveTo(n0.x*block_size + (block_size/2), n0.y*block_size + (block_size/2));
        g.lineTo(n1.x*block_size + (block_size/2), n1.y*block_size + (block_size/2));
        g.stroke();
        
    }
}


///////////////////////////////////////////////////////////////////////////////
// Other

function minimum(x, y){
    if(x<y){
        return x;
    }
    return y;
}


///////////////////////////////////////////////////////////////////////////////
// Files with exporting

function export_map_payload(){
  
    //give each node a referernce to its respective paths
    for(var i = 0; i < paths.length; i++){
        add_reference(i);
    }
    
    var payload = build_map_payload();
    
    send_payload(payload);
    
}

function add_reference(path_index){
    
    var node_index_0 = paths[path_index].end_points[0];
    var node_index_1 = paths[path_index].end_points[1];
    
    nodes[node_index_0].adj.push(node_index_1);
    nodes[node_index_0].paths.push(path_index);
    nodes[node_index_1].adj.push(node_index_0);
    nodes[node_index_1].paths.push(path_index);
    
} 

function build_map_payload(){
   
    var payload = {
        
        height: GRID_DIM,
        width: GRID_DIM,
        
        nodes: nodes.slice(),
        castles: castles,
        startingCastles: castles,
        paths: paths
             
    }
    
    //Game takes nodes with spaces of increments 100 pixels
    for(var i=0; i<payload.nodes.length; i++){
       payload.nodes[i].x = payload.nodes[i].x * 100;
       payload.nodes[i].y = payload.nodes[i].y * 100;
    }
    
    return payload;
    
}

function getPath(){
    var path = prompt("Enter the file path in the form \'/folder/fileName.txt\'" +
               "\nWhere the file path starts at your root directory or C drive");
    
    return path;
}

function send_payload(payload){
 
    var xhr = new XMLHttpRequest();
    var url = "/";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json"); 
    
    var path = getPath();
    
    var wrapper = {
        path: path,
        payload: payload
    }
    
    var data = JSON.stringify(wrapper);
    //alert(data);
    xhr.send(data);             
}


///////////////////////////////////////////////////////////////////////////////
// Main
var canvas = document.getElementById('grid');
var rect = canvas.getBoundingClientRect();

grid_height = rect.bottom - rect.top;
grid_width = rect.right - rect.left;
block_size = minimum( grid_height, grid_width ) / GRID_DIM;

draw();

