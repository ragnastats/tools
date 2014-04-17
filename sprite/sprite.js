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
    var timeout = 0;
    
    $.each(request.body, function(item, frame)
    {        
        var item64 = new Buffer(item).toString('base64').replace(/\//g, '-');
        var frame64 = frame[0].replace(/^data:image\/png;base64,/,"");

        // Use setTimeout to prevent error: EMFILE, too many open files
        setTimeout(function()
        {
            require("fs").writeFile("export/"+item64+".png", frame64, 'base64', function(err)
            {
                if(err)
                {
                    console.log(err);
                }

                console.log("Saved item: "+item64+".png");
            });        
        }, timeout);

        timeout += 1;
    });
});

app.listen(1337);
