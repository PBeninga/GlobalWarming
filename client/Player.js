class Player {
  constructor(id, color) {
    this.id = id;
    this.color = color;
    this.armies = [];
    this.updated = [];
  }

  removeArmy(id) {
    this.armies[id].destroyGraphics();
    this.armies.splice(id, 1);
    this.updated.splice(id, 1);
    for(var i = id; i < this.armies.length; i++) {
      this.armies[i].id -= 1;
    }
  }

  getArmyId(x, y) {
    for(var i = 0; i < this.armies.length; i++) {
      if(this.armies[i].x == x && this.armies[i].y == y) {
        return i;
      }
    }
    return -1;
  }

  updateArmy(count, node) {
    for(var i = 0; i < this.armies.length; i++) {
      if(this.armies[i].node.id == node.id) {
        this.armies[i].count = count;
        this.updated[i] = true;
      }
    }
  }

  removeArmies() {
    for(var i = 0; i < this.updated.length; i++) {
      if(!this.updated[i]) {
        this.removeArmy(i);
      }
    }
  }

  clearUpdated() {
    for(var i = 0; i < this.updated.length; i++) {
      this.updated[i] = false;
    }
  }

  updateArmies() {
    for(var i = 0; i < this.armies.length; i++) {
      this.armies[i].update();
    }
  }

  addArmy(count, node, callback) {
    let newArmy = new Army(count, this, node);
    newArmy.id = this.armies.length;
    newArmy.display();
    this.armies.push(newArmy);
    this.updated.push(true);
    return newArmy;
  }
}
