var gameMap;

class GameMap {
  constructor() {
    this.nodes = [];
    this.armies = [];
    this.swipe = [];
  }

  addNode(newNode, game) {
    newNode.graphics.inputEnabled = true;
		newNode.graphics.events.onInputDown.add(function(){gameMap.swipe(newNode)});
		newNode.graphics.events.onInputOver.add(function(){gameMap.mouseOver(newNode)});
		newNode.graphics.events.onInputUp.add(function(){gameMap.endSwipe()});
    this.nodes.push(newNode);
    newNode.display(game);
  }

  swipe(node) {
    console.log("Reached Swipe");
    swipe.push(node);
  }

  mouseOver(node) {
    console.log("Reached mouseOver");
    if(swipe.length != 0) {
      if(validNode(swipe[swipe.length-1], node)) {
        swipe.push(node);
        console.log("Added node " + node.id);
      }
      else {
        console.log(node.id + " not a valid node");
      }
    }
  }

  endSwipe() {
    console.log("Reached endSwipe");
    if(swipe.length > 1) {
      console.log("Swiped from " + swipe[0].id + " to ")
      for(var i = 1; i < swipe.length; i++) {
        console.log(" " + swipe[i].id);
      }
    }
    else {
      console.log("swipe failed");
    }
    swipe = [];
  }
}

function getGameMapInstance() {
  if(gameMap == null) {
    gameMap = new GameMap();
  }
  else {
    return gameMap;
  }
}

function validNode(node1, node2) {
  if(node1.adj.includes(node2)) {
    return true;
  }
  else {
    return false;
  }
}
