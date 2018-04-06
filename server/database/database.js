/**
 * File to init and manage MongoDb database on the Heroku server
 * In app.js, call:
 *    init()
 */

let mongoose = require('mongoose');
const uri = 'mongodb://glAdmin:GlobalWarming2018@ds243798.mlab.com:43798/heroku_s7k63t29'

class Database{
   constructor() {
      mongoose.connect(uri, function(err){
         if(err) throw err;
      });
   
      this.Player = mongoose.model(
         'Player',
         mongoose.Schema({
            username:   String,
            password:   String,
            stats:      {
               gamesWon:   Number,
               gamesLost:  Number
            },
            friends: [{
               name: String,
            }]
         })
      );
   }

   findAll(modelName) {
      return new Promise((resolve,reject)=>{
         var model = null;
         var data = null;
         if(modelName == 'Player') model = this.Player;
         else {
            console.log('Enter valid model name');
            return;
         }
         model.find(function(err, docs) {
            if(err) reject(err);
            resolve(docs);
         });
      });
   }

   findOne(modelName, query) {
      return new Promise((resolve,reject)=>{
         var model = null;
         var data = null;
         if(modelName == 'Player') model = this.Player;
         else {
            console.log('Enter valid model name');
            return
         }
         model.findOne(query, function(err, docs) {
            if(err) reject(err);
            resolve(docs);
         });
      });
   }

   remove(modelName, query) {
      return new Promise((resolve,reject)=>{
         var model = null;
         if(modelName == 'Player') model = this.Player;
         else {
            console.log('Enter valid model name');
            return;
         }
         model.remove(query, function(err, doc) {
            if(err) reject(err);
            console.log('Successfully removed document in collection ' + modelName);
            resolve(doc);
         });
      });
   }

   insertOne(modelName, doc) {
      return new Promise((resolve,reject)=>{
         var model = null;
         if(modelName == 'Player') model = this.Player;
         else {
            reject('Enter valid model name');
            return;
         }
         var data = new model(doc);
         console.log("something else");
         data.save(function(err) {
            console.log("something");
            if(err) reject(err);
         });
      });
   }

   insertMany(modelName, documents) {
      return new Promise((resolve,reject)=>{
         for(i in documents) {
            this.insertOne(modelName, documents[i]);
         }
      });
   }
}

module.exports = {
   Database: Database
}
