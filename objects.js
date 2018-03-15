//import { setTimeout } from "timers";
//updateArmies
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

class Game{
   constructor(room, roomid){
      this.players = [];
      this.time = new Date().getTime();
      this.room = room;
      this.map = new Map(); //WHATS GONNA HAPPEN HERE
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
            this.map.nodes[toRemove[i]].army = new Army(null,50);
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
      let player = new Player(id);
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
                    this.map.buffer.splice(i,1);
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

class Map{
   constructor(){
      this.nodes = [];
      this.castles = [];//which indicies of nodes are castles;
      this.castlesChanged = [];
      this.buffer = [];
      //this.paths = [];
   }

   incrementAllTroops(num){
      for(var i = 0; i < this.nodes.length;i++){
         if(this.nodes[i].buff != null && this.nodes[i].army.player != null){
            this.nodes[i].army.count += num;
         }
      }
   }

   moveArmy(nodes,player){
      var startNode = this.nodes[nodes[0]];
      var endNode = this.nodes[nodes[1]];
      if(startNode.army.player == player.id){
         //if startNode is a castle only move half the troops
         if(startNode instanceof Castle){
            var toMove = Math.floor(startNode.army.count/2);
            startNode.army.count -= toMove;
         }else{ //move all the troops
            toMove = startNode.army.count;
            player.armies.splice(player.findArmyIndexById(startNode.army.id),1);
            startNode.army = null;
         }
         this.buffer.push({nodes:nodes, army:new Army(player, toMove), percentage:0});

         //if end node is empty, add dummy army to be overwritten by moving troops
        //  if(endNode.army == null){
        //     endNode.army = new Army(null,0);
        //  }
        //  //if end node contains your army, just combine armies
        //  if(endNode.army.player == player){
        //     endNode.army.count += toMove;
        //  }else{ //battle
        //     //if enemy army is greater, decrease enemy army by your attacking army count
        //     if(endNode.army.count >= toMove){
        //        endNode.army.count -= toMove;
        //     }else{//conquer the node with your remaning troops (the difference)
        //        endNode.army = new Army(player,toMove-endNode.army.count);
        //     }
        //  }
      }
   }

    finishedMovingArmy(nodes,army){
        let endNode = this.nodes[nodes[1]];
        if(endNode.army == null){
            endNode.army = new Army(null,0);
         }
         //if end node contains your army, just combine armies
         if(endNode.army == null){
             endNode.army = new Army(null,0);
        }
         if(endNode.army.player == army.player){
            endNode.army.count += army.count;
         }else{ //battle
            //if enemy army is greater, decrease enemy army by your attacking army count
            if(endNode.army.count >= army.count){
               endNode.army.count -= army.count;
            }else{//conquer the node with your remaning troops (the difference)
               army.count -= endNode.army.count;
               endNode.army = army;
            }
        }
    }
}
class MapNode{
   constructor(x,y,adj, id){
      this.id = id;
      this.x = x;
      this.y = y;
      this.adj = adj;
      this.paths = [];
      for(var i = 0; i < adj.length; i++){
          this.paths.push(new Path(id, adj[i]));
      }
      this.army = null;
   }
}

class Castle extends MapNode{
   constructor(x,y,adj, id){
      super(x,y,adj, id);
      this.army = new Army(null,50);
      this.buff='none';
   }

   assignPlayer(player){ //when player intially joins and is assigned a castle
      this.army = new Army(player,50);
   }
}

class Army{
   constructor(player,size){
      this.id = generateID(20);
      if(player){
        this.player = player.id;
        player.armies.push(this);
      }
      this.count = size;
      //this.buff = "swole";
   }
}
class Path{
    constructor(startNode, endNode){
        this.startNode = startNode;
        this.endNode = endNode;
        this.id =  startNode+" "+endNode;
    }
}
function generateID(length) {
    let text = ""
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for(let i = 0; i < length; i++)  {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
}
/*
//create game with a castle and an empty node
var game = new Game();
game.map.nodes = [new Castle(0,0,[1]),new MapNode(1,1,[0])];

//add player with id 2, they should be put in the castle.
console.log("\nAdd player 2\n");
game.addPlayer(2);
console.log(game);
console.log(game.map.nodes[0]);
console.log(game.map.nodes[1]);

//gives player 2, 100 troops
console.log("\nincrement troops\n");
game.incrementTroops(100);
console.log(game);
console.log(game.map.nodes[0]);
console.log(game.map.nodes[1]);

//player 2 swipes from castle to node
console.log("\nMove from player 2 to node\n");
game.moveArmy([0,1],2);
console.log(game);
console.log(game.map.nodes[0]);
console.log(game.map.nodes[1]);

//player 2 swipes back from node to castle
console.log("\nMove from node to player 2\n");
game.moveArmy([1,0],2);
console.log(game);
console.log(game.map.nodes[0]);
console.log(game.map.nodes[1]);

//attempts to remove player 3, even though they don't exist
console.log("\nRemove player 3\n");
game.removePlayer(3);
console.log(game);
console.log(game.map.nodes[0]);
console.log(game.map.nodes[1]);

//removes player 2
console.log("\nRemove player 2\n");
game.removePlayer(2);
console.log(game);
console.log(game.map.nodes[0]);
console.log(game.map.nodes[1]);

//does nothing since no one owns troops
console.log("\nincrement troops\n");
game.incrementTroops(1);
console.log(game);
console.log(game.map.nodes[0]);
console.log(game.map.nodes[1]);

*/

/*
NOT IMPLEMENTED
class Path{
   constructor(nodeA,nodeB){
      this.nodes = [];
      this.nodes.push(nodeA);
      this.nodes.push(nodeB);
      this.armies = [];
   }
   //movements
}

class Army{
   constructor(id,size){
      this.player = id;
      this.troops = size;
      this.buff = "swole";
   }
}
*/

module.exports = {
    MapNode:MapNode,
    Game:Game,
    //Path:Path,
    Army:Army,
    Castle:Castle
};
