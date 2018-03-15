class Path {
  constructor(Node1, Node2) {
    this.start = Node1;
    this.end = Node2;
    this.graphics = null;
    this.distance = distance(Node1, Node2);
  }

  display() {
    this.graphics = game.add.graphics();
    this.graphics.beginFill(0xFF3300);
    this.graphics.lineStyle(10, 0xffd900, 1);
    if(this.start.graphics.x < this.end.graphics.x) {
      this.graphics.drawRect(this.start.graphics.x, this.start.graphics.y,
                                                  xdistance(this.start, this.end), this.start.height);
    }
    if(this.start.graphics.x > this.end.graphics.x) {
      this.graphics.drawRect(this.end.graphics.x, this.end.graphics.y,
                                                  xdistance(this.start, this.end), this.end.height);
    }
    if(this.start.graphics.y < this.end.graphics.y) {
      this.graphics.drawRect(this.start.graphics.x, this.start.graphics.y,
                                                  this.start.width, ydistance(this.start, this.end));
    }
    if(this.start.graphics.y > this.end.graphics.y) {
      this.graphics.drawRect(this.end.graphics.x, this.end.graphics.y,
                                                  this.end.width, ydistance(this.start, this.end));
    }
    this.graphics.endFill();
  }
}

function percentToX(percent) {
  if(this.start.graphics.x < this.end.graphics.x) {
    return this.start.graphics.x + (distance * percent);
  }
  return this.start.graphics.x - (distance * percent);
}

function percentToY(percent) {
  if(this.start.graphics.y < this.end.graphics.y) {
    return this.start.graphics.y + (distance * percent);
  }
  return this.start.graphics.y - (distance * percent);
}

function distance (Node1, Node2) {
  return Math.sqrt(Math.pow(Node1.x - Node2.x,2) + Math.pow(Node1.y - Node2.y,2));
}
function xdistance (Node1, Node2) {
  return Math.abs(Node1.x - Node2.x);
}
function ydistance (Node1, Node2) {
  return Math.abs(Node1.y - Node2.y);
}
