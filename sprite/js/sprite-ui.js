var border = true;

$().ready(function(){
    $('span.filename').click(function(){
        $('#fileSearch .filename').val("spr/"+$(this).html());
        $('#fileSearch').submit();
    });

    $('a').click(function(e){
        $('canvas').toggleClass('border');
        border = false;
        e.preventDefault();
    });

    var dropbox = $('html')[0];
    dropbox.addEventListener("dragenter", dragEnter, false);
    dropbox.addEventListener("dragexit", dragExit, false);
    dropbox.addEventListener("dragover", dragOver, false);
    dropbox.addEventListener("drop", drop, false);

    function dragEnter(e){
        $('#dropBox').css('borderColor', '#777').css('color', '#777');
        e.stopPropagation();
        e.preventDefault();
    }

    function dragExit(e){
        $('#dropBox').css('borderColor', '#aaa').css('color', '#aaa');
        e.stopPropagation();
        e.preventDefault();
    }

    function dragOver(e){
        e.stopPropagation();
        e.preventDefault();
    }

    function drop(e){
        $('#dropBox').css('borderColor', '#aaa').css('color', '#aaa');
        e.stopPropagation();
        e.preventDefault();

        var files = e.dataTransfer.files;
        var count = files.length;

        $('#messages').html('Now Loading...');
        $('canvas, h2, hr, br').remove();

        var reader = new Array();
        
        for(i=0;i<files.length;i++){
            reader[i] = new FileReader();

            reader[i].fileName = files[i].name;

            reader[i].onloadend = function(e){
                var data = new jDataView(e.target.result);

                parseSprite(data, this.fileName);
            }

            reader[i].readAsBinaryString(files[i]);
        }
    }

    $('#fileSearch').submit(function(e){
        $('#messages').html('Now Loading...');
        $('canvas, h2, hr, br, img').remove();

        var xhr = new XMLHttpRequest();
        xhr.open("GET", $('#fileSearch .filename').val(), true);
        xhr.responseType = "arraybuffer";

        xhr.onload = function(e) {
            var data = new jDataView(xhr.response);

            parseSprite(data, $('#fileSearch .filename').val());
            
        };

        xhr.send(null);

        e.preventDefault();
    });

    function parseSprite(data, fileName){
        var sprite = new sprFile(data);

        $('body').append('<hr>').append('<h2>' + fileName + '</h2>');

        for(var j=0;j<sprite.sprite.imageCount;j++){
            var rand = Math.random();
            $('body').append('<canvas id="sprite' + rand + '_' + j + '" width="' + sprite.sprite.images[j].size.x + '" height="' + sprite.sprite.images[j].size.y + '" class="' + (border?'border':'') + '"></canvas>');

            context = document.getElementById('sprite' + rand + '_' + j).getContext('2d');
    
            var pixelData = context.createImageData(sprite.sprite.images[j].size.x, sprite.sprite.images[j].size.y);

            paletteIndex = 0;

            for(var i=0;i<sprite.sprite.images[j].imageData.length;i++){
                if(sprite.sprite.images[j].imageData[i] != paletteIndex){
                    paletteIndex = sprite.sprite.images[j].imageData[i];
                }
                if(paletteIndex != 0){
                    pixelData.data[i*4] = sprite.sprite.palette[paletteIndex].r;
                    pixelData.data[i*4+1] = sprite.sprite.palette[paletteIndex].g;
                    pixelData.data[i*4+2] = sprite.sprite.palette[paletteIndex].b;
                    pixelData.data[i*4+3] = sprite.sprite.palette[paletteIndex].a;
                }
            }

            context.putImageData(pixelData, 0, 0);
            var canvas = document.getElementById('sprite' + rand + '_' + j);
            $('body').append("<img src='"+canvas.toDataURL()+"' class='" + (border?'border':'') + "'>");
        }
        
        for(var j=0;j<sprite.sprite.rgbaImageCount;j++){
            var rand = Math.random();
            $('body').append('<canvas id="sprite' + rand + '_' + j + '" width="' + sprite.sprite.rgbaImages[j].size.x + '" height="' + sprite.sprite.rgbaImages[j].size.y + '" class="' + (border?'border':'') + '"></canvas>');

            context = document.getElementById('sprite' + rand + '_' + j).getContext('2d');
    
            var pixelData = context.createImageData(sprite.sprite.rgbaImages[j].size.x, sprite.sprite.rgbaImages[j].size.y);

            for(var i=0;i<sprite.sprite.rgbaImages[j].imageData.length;i++){
                pixelData.data[i] = sprite.sprite.rgbaImages[j].imageData[i];
            }

            context.putImageData(pixelData, 0, 0);
            var canvas = document.getElementById('sprite' + rand + '_' + j);
            $('body').append("<img src='"+canvas.toDataURL()+"' class='" + (border?'border':'') + "'>");
        }
        
        $('body').append('<br>');

        $('#messages').html('');
    }
});
