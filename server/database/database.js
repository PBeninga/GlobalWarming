/**
 * File to init and manage MongoDb database on the Heroku server
 * In app.js, call:
 *    init()
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

const uri = 'mongodb://glAdmin:GlobalWarming2018@ds243798.mlab.com:43798/heroku_s7k63t29'

var UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    stats:      {
       gamesWon:   Number,
       gamesLost:  Number
    },
    friends: [{
       name: String,
    }]
});

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


class Database{
   constructor() {
      mongoose.connect(uri, function(err){
         if(err) throw err;
         console.log('Successfully connected to MongoDB');
      });
      this.Player = mongoose.model('Player', UserSchema);
   }


   findAll(modelName) {
      return new Promise((resolve,reject)=>{
         var model = null;
         var data = null;
         if(modelName == 'Player') 
            model = this.Player;
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
         if(modelName == 'Player') 
            model = this.Player;
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

   
   insertOne(modelName, doc) { //doc: {'username': userName.value, 'password' : password.value}
      return new Promise((resolve,reject)=>{
         var model = null;
         if(modelName == 'Player') model = this.Player;
         else {
            reject('Enter valid model name');
            return;
         }
         var data = new model(doc);
         data.save(function(err) {
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
