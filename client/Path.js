class Path {
  constructor(Node1, Node2) {
    this.start = Node1;
    this.end = Node2;
    this.graphics = null;
    this.distance = distance(Node1, Node2);
  }

  display() {
    this.graphics = game.add.graphics();/*
    this.graphics.beginFill(0xFF3300);
    this.graphics.lineStyle(10, 0xffd900, 1);
    if(this.start.x < this.end.x) {
      this.graphics.drawRect(this.start.x, this.start.y,
                                                  xdistance(this.start, this.end), this.start.height);
    }
    if(this.start.x > this.end.x) {
      this.graphics.drawRect(this.end.x, this.end.y,
                                                  xdistance(this.start, this.end), this.end.height);
    }
    if(this.start.y < this.end.y) {
      this.graphics.drawRect(this.start.x, this.start.y,
                                                  this.start.width, ydistance(this.start, this.end));
    }
    if(this.start.y > this.end.y) {
      this.graphics.drawRect(this.end.x, this.end.y,
                                                  this.end.width, ydistance(this.start, this.end));
    }
    this.graphics.endFill();*/
  }

  percentToX(percent) {
    if(this.start.x < this.end.x) {
      return this.start.x + (this.distance * percent);
    }
    if(this.start.x > this.end.x) {
      return this.start.x - (this.distance * percent);
    }
    return this.start.x;
  }

  percentToY(percent) {
    if(this.start.y < this.end.y) {
      return this.start.y + (this.distance * percent);
    }
    if(this.start.y > this.end.y) {
      return this.start.y - (this.distance * percent);
    }
    return this.start.y;
  }
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
