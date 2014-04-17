/***************************************************************
 *
 * Functions for exporting base64 images to servers
 *
 */

var sprites = {
    table: {},
    unique: 0,
    length: 0,

    // Hidden friendship function
    populate: function(callback)
    {
        // Load sprite name table
        $.get("grf/idnum2itemresnametable.txt", function(response)
        {
            var items = response.split("\n");

            $.each(items, function(index, item)
            {
                if(/[0-9]+#[^#]+#/.test(item))
                {
                    item = item.split("#");

                    if(typeof sprites.table[item[1]] == "undefined")
                        sprites.unique++;
                    
                    sprites.table[item[1]] = item[0];
                    sprites.length++;
                }
            });

            if(typeof callback == "function")
                callback();
        });
    },
    
    export: function(url)
    {
        // Build post request
        var request = {length: 0};

        $('.sprite').each(function()
        {            
            var file = $(this).find('h2').text().replace('.spr', '');

            var sprite = {
                name: file,
                frames: []
            };

            $(this).find('img').each(function()
            {
                sprite.frames.push($(this).attr('src'));
            });

            request[sprite.name] = sprite.frames;
        });

        // Post to specified URL
        $.post(url, request, function(response)
        {

        });
    }
};
