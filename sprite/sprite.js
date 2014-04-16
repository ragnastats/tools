var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser({limit: '50mb'}));

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});


app.post('/export', function(request, response)
{
    console.log(request.body);
});

app.listen(1337);
