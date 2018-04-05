class Player{
    constructor(id){
        this.id = id;
        this.name = null;
        this.armies = [];
    }
    findArmyIndexById(id){
        for(var i = 0; i <  this.armies.length; i++){
            if(this.armies[i] == id){
                return i;
            }
        }
        return -1;
    }
    findArmyById(id){
        let index  = this.findArmyIndexById(id);
        if(index > -1){
            return armies[index];
        }else{
            return null;
        }
    }
}

module.exports = {
    Player:Player
};
