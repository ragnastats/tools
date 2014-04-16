var sprFile = function (data){

    this.sprite = {
        bytes: data,

        header: data.getString(2),

        version: {
            major: data.getUint8(),
            minor: data.getUint8()
        },
        
        imageCount: data.getUint16(),
        rgbaImageCount: data.getUint16()
    };
    this.sprite.images = this.parseImages(this.sprite.imageCount);
    this.sprite.rgbaImages = this.parseRgbaImages(this.sprite.rgbaImageCount);

    //data.seek(data.length - 1024);
    
    this.sprite.palette = this.parsePalette();

};

sprFile.prototype = {
    
    parseImages: function(){
        var images = [];
        for(var i=0;i<this.sprite.imageCount;i++){
            images.push(this.parseImage());
        }
        return images;
    },

    parseImage: function(){
        var image = {
            size: {
                x: this.sprite.bytes.getUint16(),
                y: this.sprite.bytes.getUint16()
            }
        }

        image.frameLength = (this.sprite.version.major==0 ? image.size.x * image.size.y: this.sprite.bytes.getUint16());

        imageData = [];

        for(var i=0;i<image.frameLength;i++){
            val = this.sprite.bytes.getUint8();

            imageData.push(val);
            
            if(val==0 && this.sprite.version.major!=0){
                i++;
                val = this.sprite.bytes.getUint8();

                if(val<256)
                    for(var j=1;j<val;j++)
                        imageData.push(0);
                else
                    imageData.push(val);
            }
        }

        image.imageData = imageData;

        return image;
    },

    parseRgbaImages: function(){
        var images = [];
        for(var i=0;i<this.sprite.rgbaImageCount;i++){
            images.push(this.parseRgbaImage());
        }
        return images;
    },

    parseRgbaImage: function(){
        var image = {
            size: {
                x: this.sprite.bytes.getUint16(),
                y: this.sprite.bytes.getUint16()
            }
        }
        image.frameLength = (image.size.x * image.size.y);

        imageData = [];

        for(var i=0;i<image.frameLength*4;i++){
            val = this.sprite.bytes.getUint8();

            imageData.push(val);
        }

        image.imageData = imageData;

        return image;
    },

    parsePalette: function(){
        palette = [];
        
        for(var i=0;i<256;i++){
            palette.push({
                r: this.sprite.bytes.getUint8(),
                g: this.sprite.bytes.getUint8(),
                b: this.sprite.bytes.getUint8(),
                a: 255 - this.sprite.bytes.getUint8()
            });
        }

        return palette;
    }
    
}

