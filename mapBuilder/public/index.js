const BLOCK_SIZE = 20;

document.addEventListener("click", function () {
    
    var canvas = document.getElementById('grid');
    var rect = canvas.getBoundingClientRect();
    
    var xCoord = parseInt((event.clientX - rect.left) / BLOCK_SIZE);
    var yCoord = parseInt((event.clientY - rect.top) / BLOCK_SIZE);
    
    document.getElementById("demo").innerHTML = "selected block x,y: " + xCoord + ", " + yCoord;
});

function draw_grid(){
    var canvas = document.getElementById('grid');
    var g = canvas.getContext('2d');
   
    for( var x = 0; x<500; x+=BLOCK_SIZE ){
        for( var y = 0; y<500; y+= BLOCK_SIZE ){
            g.strokeRect(x,y,BLOCK_SIZE,BLOCK_SIZE);
        }
    }
}

document.body.style.backgroundColor = "gray";
draw_grid();
