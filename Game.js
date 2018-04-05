var gameMap = require('./Map.js');
var armyObject = require('./Army.js');
var playerObject = require('./Player.js');

class Game{
   constructor(room, roomid){
      this.players = [];
      this.time = new Date().getTime();
      this.room = room;
      this.map = new gameMap.Map(); //WHATS GONNA HAPPEN HERE
      this.started = false;
      this.starting = false;
      this.roomid = roomid;
      this.finished =  false;
      this.winner = null;
      this.maxPlayers = 4;
      this.timeTillStart = 10000;
      this.startingCastles = [];
      this.timeGameBeganStarting = null;
   }
   onInputFired(data, id){
        if(this.map.nodes[data.nodes[0]].army && this.map.nodes[data.nodes[0]].army.count > 0 && this.map.nodes[data.nodes[0]].army.player == id && this.started){
            this.map.moveArmy(data.nodes, this.findPlayerById(id));
        }
   }
   incrementTroops(num){
      this.map.incrementAllTroops(num);
   }
   moveArmy(nodes,player){
      this.map.moveArmy(nodes,player);
   }
   onPlayerDisconnect(){
      this.removePlayer(this.id);
   }
   removePlayer(id){
      if(this.findPlayerIndexById(id) == -1){
         console.log("Attempting to remove player that doesn't exist.");
         return;
      }
      console.log("removing player: "+id+" from game"+this.roomid);
      //find any army in a mapnode that is owned by removed player
      var toRemove = [];
      for(var i = 0; i < this.map.nodes.length; i++){
         if(this.map.nodes[i].army != null && this.map.nodes[i].army.player == id){
            toRemove.push(i);
         }
      }
      for(var i = 0; i < toRemove.length; i++){
         if(this.map.castles.indexOf(toRemove[i]) != -1){
            this.map.nodes[toRemove[i]].army = new armyObject.Army(null,50);
         }else{
             this.map.nodes[toRemove[i]].army = null;
         } // set to neutral castle
      }

      this.players.splice(this.findPlayerIndexById(id),1);

      //find any army in a path that is owned by removed player
      //NOT IMPLEMENTED
   }
   //return true on player succesfully added
   addPlayer(id){
      if(this.players.includes(id)){
         console.log("Attempting to add player that already exists.");
         return false;
      }
      //finds first node that is a castle, not owned by another player, and assigns it to the new player.
      //***need to check if castle is being attacked
      var destination = -1;
      for(var i = 0; i < this.map.startingCastles.length; i++){
         if(this.map.nodes[this.map.startingCastles[i]].army.player == null){
            var destination = this.map.startingCastles[i];
            break;
         }
      }
      if(destination == -1 || this.players.length == this.maxPlayers){
          console.log("Could not find a castle.");
          return false;
      }
      console.log("Player assigned castle.");
      let player = new playerObject.Player(id);
      this.players.push(player);
      this.map.nodes[destination].assignPlayer(player);

      return true;
   }
   endGame(){
       this.room.emit("endGame",{winner:this.winner});
   }
   findPlayerIndexById(id){
       for(var i = 0; i <  this.players.length; i++){
           if(this.players[i].id == id){

               return i;
           }
       }
       return -1;
   }
   findPlayerById(id){
       let index = this.findPlayerIndexById(id);
       if(index > -1){
           return this.players[index];
       }else{
           return null;
       }
   }
   tick(){
        var troopsToAdd = 0;
        this.room.emit('update_nodes', {nodes:this.map.nodes});

        var tickStartTime = new Date().getTime();
        if(tickStartTime - this.time >= 500){
           troopsToAdd = Math.floor((tickStartTime -this.time)/500);
           this.time = tickStartTime - (tickStartTime%500);
        }

        if(this.players.length > 1 && !this.starting && !this.started){
            this.starting = true;
            console.log("Game starting.");
            let game = this;
            this.timeGameBeganStarting = new Date().getTime();
            setTimeout(function(){
                game.started = true;
                game.room.emit('startGame');
            }, 10*1000);
        }
        if(this.started){
            if(troopsToAdd > 0){
               this.incrementTroops(troopsToAdd);
               troopsToAdd = 0;
            }
            /*
                [
                    {
                        nodes[]: 2 elements start nodes and then endnode
                        army: army moving
                        percentage: integer of percentage between paths.
                    },
                    ...

                ]
            */
            this.room.emit('move_armies', {moving:this.map.buffer});
            for(var i = 0; i < this.map.buffer.length; i++){
                this.map.buffer[i].percentage += 5;
                if(this.map.buffer[i].percentage >= 100){
                    this.map.finishedMovingArmy(this.map.buffer[i].nodes,this.map.buffer[i].army);
                    var finished  = this.map.buffer.splice(i,1)[0];
                    if(finished.nodes.length > 2){
                       finished.nodes.shift();
                       this.map.moveArmy(finished.nodes, this.findPlayerById(finished.army.player));
                    }
                }
            }
            //should be unncessary after pathTraversal is merged
            var playersInGame = [];
            for(var i = 0; i < this.map.nodes.length; i++){
                if(this.map.nodes[i].army){
                    if(playersInGame.indexOf(this.map.nodes[i].army.player) == -1 && this.map.nodes[i].army.player != null){
                        playersInGame.push(this.map.nodes[i].army.player);
                    }
                }
            }
            if(playersInGame.length <= 1 && game.started){
                if(playersInGame.length == 1){
                    this.winner = playersInGame[0];
                }
                game.finished = true;
            }
        }else if(this.starting){
            this.timeTillStart = 10000 - (new Date().getTime() - this.timeGameBeganStarting);
            this.room.emit('updateTime',{time:this.timeTillStart});
        }
    }
}

module.exports = {
    Game:Game
};
