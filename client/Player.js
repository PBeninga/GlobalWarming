class Player {
  constructor(id, color) {
    this.id = id;
    this.color = color;
    this.armies = [];
    this.updated = [];
  }

  // Removes the army with the given ID, destroying it's graphics and removing
  // it from the updated and armies list.
  removeArmy(id) {
    this.armies[id].destroyGraphics();
    this.armies.splice(id, 1);
    this.updated.splice(id, 1);
    for(var i = id; i < this.armies.length; i++) {
      this.armies[i].id -= 1;
    }
  }

  // Gets the ID of the army at the given location
  getArmyId(x, y) {
    for(var i = 0; i < this.armies.length; i++) {
      if(this.armies[i].x == x && this.armies[i].y == y) {
        return i;
      }
    }
    return -1;
  }

  // Updates the army at the given node by the given count
  updateArmy(count, node) {
    for(var i = 0; i < this.armies.length; i++) {
      if(this.armies[i].node.id == node.id) {
        this.armies[i].count = count;
        this.updated[i] = true;
      }
    }
  }

  // Removes all armies that aren't on the 'updated' list
  removeArmies() {
    for(var i = 0; i < this.updated.length; i++) {
      if(!this.updated[i]) {
        this.removeArmy(i);
      }
    }
  }

  // Clears the updated list to prepare for the next tick
  clearUpdated() {
    for(var i = 0; i < this.updated.length; i++) {
      this.updated[i] = false;
    }
  }

  // Updates all armies with their new values
  updateArmies() {
    for(var i = 0; i < this.armies.length; i++) {
      this.armies[i].update();
    }
  }

  // Adds a new army to the armies list. Does not initialize their callback.
  addArmy(count, node, callback) {
    let newArmy = new Army(count, this, node);
    newArmy.id = this.armies.length;
    newArmy.display();
    this.armies.push(newArmy);
    this.updated.push(true);
    return newArmy;
  }
}
