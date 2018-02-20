function merge(army1, army2) {
  if(army1.owner == army2.owner && army1.node_id == army2.node_id) {
    let newArmy = new Army(army1.count + army2.count, army1.owner, army1.node_id);
    return newArmy;
  }
  return null;
}

class Army {
  constructor(count, owner, node_id) {
    this.count = count;
    this.owner = owner;
    this.node_id = node_id;
  }
}
