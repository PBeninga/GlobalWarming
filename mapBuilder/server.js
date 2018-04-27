const express = require('express');
const app = express();
const path = require('path');

//////////////
// JSON Parsing stuff
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

var fs = require('fs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

///////////////
// Express stuff

app.use('/public', express.static(__dirname + '/public'));


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.post('/', function (req, res) {
    
    const fs = require('fs');
    var path = req.body.path;
    var data = JSON.stringify(req.body.payload); 
    console.log(data);
    
    fs.writeFile( path, data, function(err){
        if (err){
           console.log(path);
           throw err;
        }
    });
    
})

app.listen(4000, function () {
    console.log('mapBuilder app listening on port 4000!');
})
