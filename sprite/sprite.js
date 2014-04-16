var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var $ = require('node-jquery');

app.use(bodyParser({limit: '50mb'}));

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});


app.post('/export', function(request, response)
{
    $.each(request.body, function(item, frame)
    {
        console.log(item);
    });
});

app.listen(1337);
