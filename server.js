var express = require('express');
var bodyParser = require('body-parser');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static(__dirname + ''));

app.listen(8080, function() {
    console.log('***********************************');
    console.log('listening:', 8080);
    console.log('***********************************');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


