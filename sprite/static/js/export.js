/***************************************************************
 *
 * Functions for exporting base64 images to servers
 *
 */

var sprite = {
    table: {},

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
                    sprite.table[item[1]] = item[0];
                }
            });

            if(typeof callback == "function")
                callback();
        });
    },
    
    export: function(url)
    {
        // Build post request
        var request = {};

        $('.sprite').each(function()
        {
            var sprite = {
                name: $(this).find('h2').text(),
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
