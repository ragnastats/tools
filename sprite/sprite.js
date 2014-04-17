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
        var base64Data = frame[0].replace(/^data:image\/png;base64,/,"");

        require("fs").writeFile("export/"+item+".png", base64Data, 'base64', function(err) {
          console.log(err);
        });
        
        console.log("Saved item: "+item+".png");
    });
});

app.listen(1337);
