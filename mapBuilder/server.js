const express = require('express');
const app = express();
const path = require('path');

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.post('/', function (req, res) {
    res.send("This is the callback from a post");
})

app.use('/public', express.static(__dirname + '/public'));

app.listen(4000, function () {
    console.log('mapBuilder app listening on port 4000!');
})
