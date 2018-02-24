//GRID
const BLOCK_SIZE = 20;

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

    // some fancy math to get the grid col (x)  and row (y) of the given click
    selected_block.x = parseInt((event.clientX - rect.left) / BLOCK_SIZE);
    selected_block.y = parseInt((event.clientY - rect.top) / BLOCK_SIZE);
   
    // if the click is not inside of the canvas
    if( selected_block.x < 0 || selected_block.x > 25 ||
        selected_block.y < 0 || selected_block.y > 25){
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
            state=10;
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
    
    var c = {
        node_index: nodes.length-1
    }
    castles.push(c);
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
           end_points:[
               nodes[prev_node],
               nodes[index]
           ] 
        }
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
   
    g.clearRect(0,0,500,500);
    draw_grid(g);
    draw_selected_block(g);
    draw_paths(g);
    draw_nodes(g);
    draw_castles(g);
}

function draw_grid(g){
    
    g.strokeStyle=BLACK;
    g.lineWidth=.5;
    
    for( var x = 0; x<500; x+=BLOCK_SIZE ){
        for( var y = 0; y<500; y+= BLOCK_SIZE ){
            g.strokeRect(x,y,BLOCK_SIZE,BLOCK_SIZE);
        }
    }
}

function draw_selected_block(g){
    if(selected_block.x >= 0 && selected_block.y >= 0 ){
        var xCoord = selected_block.x * 20;
        var yCoord = selected_block.y * 20;
   
        g.lineWidth=4;
        g.strokeStyle=RED;
        g.strokeRect(xCoord, yCoord, BLOCK_SIZE, BLOCK_SIZE);    
    }
}

function draw_nodes(g){
    g.fillStyle=TAN;
    for( var i = 0; i<nodes.length; i++){
       g.fillRect(nodes[i].x*BLOCK_SIZE, nodes[i].y*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    } 
}

function draw_castles(g){
    g.fillStyle=BLACK;
    for( var i=0; i<castles.length; i++){
        var temp = nodes[castles[i].node_index];
        g.fillRect(temp.x*BLOCK_SIZE, temp.y*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
}

function draw_paths(g){
    for(var i = 0; i < paths.length; i ++ ){
        var n1 = paths[i].end_points[0];
        var n2 = paths[i].end_points[1];
        g.strokeStyle=RED;
        
        g.moveTo(n1.x*BLOCK_SIZE + (BLOCK_SIZE/2), n1.y*BLOCK_SIZE + (BLOCK_SIZE/2));
        g.lineTo(n2.x*BLOCK_SIZE + (BLOCK_SIZE/2), n2.y*BLOCK_SIZE + (BLOCK_SIZE/2));
        g.stroke();
        
    }
}

///////////////////////////////////////////////////////////////////////////////
// Main

draw();
