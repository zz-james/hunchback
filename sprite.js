"use strict";


var PIX = (function (my) {

    /**
     * This function initializes a sprite with the params sent
     *
     * @param x
     * @param y
     * @param ac
     * @param as
     * @param mc
     * @param ms
     */
    my.SPR_NewSprite = function(x,y,w,h,ac,as,mc,ms,st) {

        var sprite = {
            x            : x,
            y            : y,
            x_old        : x,
            y_old        : y,
            x_tile       : (x >> 5),
            y_tile       : (y >> 5),
            width        : w,
            height       : h,
            anim_clock   : ac,
            anim_speed   : as,
            motion_clock : mc,
            motion_speed : ms,
            curr_frame   : 0,
            state        : st,
            num_frames   : 0,
            background   : new Uint32Array(w * h), //32 bit so use normal sprite.width
            frames: []
        };

        return sprite;
    };


    /**
     * This function will grab a bitmap from the picture object buffer. it uses the
     * convention that the 320x200 pixel matrix is sub divided into a smaller
     * matrix of nxn adjacent squares of size sprite.height X sprite.width
     * buffers are 32 bit so use normal sprite.width
     * @param picture - picture object
     * @param sprite - sprite object
     * @param frame - index of 'frames' in the sprite object
     * @param grab_x - x point in pixels to start grabbing from the picture buffer
     * @param grab_y - y point in pixels to start grabbing from the picture buffer
     */
    my.SPR_GrabBitmap = function(spritesheet, sprite, frame, grab_x, grab_y) {
        var pixels = spritesheet.rgb;
        var sheet_width = spritesheet.surface.width;
        var x_off,y_off, x,y;
        var sprite_data; // just a useful alias to array members
        var sprite_height = sprite.height; // cache property as a local
        var sprite_width = sprite.width;


        // first allocate the memory for the sprite in the sprite structure
        sprite.frames[frame] = new Uint32Array(sprite_width * sprite_height);

        // create an alias to the sprite frame for ease of access
        sprite_data = sprite.frames[frame];

        // now load the sprite data into the sprite frame array from the picture
        x_off = (sprite_width+1)  * grab_x + 1;
        y_off = (sprite_height+1) * grab_y + 1;

        // compute starting y address
        y_off = y_off * sheet_width;

        for (y=0; y<sprite_height; y++)
        {
            for (x=0; x<sprite_width; x++)
            {
                // get the next byte of current row and place into next position in
                // sprite frame data buffer
                sprite_data[y*sprite_width + x] = pixels[y_off + x_off + x];
            }
            // move to next line of picture buffer
            y_off+=sheet_width;
        }
        // increment number of frames
        sprite.num_frames++;
    };


    /**
     * this function replaces the background that was saved from where a sprite
     * was going to be placed
     * @param sprite
     */
    my.SPR_EraseSprite = function(sprite) {

        //replace the background that was behind the sprite
        var work_back;
        var work_offset=0,offset,y;
        var byte_SPRITE_WIDTH = sprite.width << 2; // 4 bytes per pixel.

        // alias a pointer to sprite background for ease of access
        work_back = sprite.background.buffer;

        // compute offset of background in video buffer
        offset = (sprite.y * my.byteMainBufferWidth) + (sprite.x << 2); //sprite x converted to bytes

        for (y=0; y< sprite.height; y++)
        {
            // copy the next row out off screen buffer into sprite background buffer
            my.memcpy(my.mainBuffer,offset,work_back,work_offset,byte_SPRITE_WIDTH);

            // move to next line in video buffer and in sprite background buffer
            offset      += my.byteMainBufferWidth;
            work_offset += byte_SPRITE_WIDTH;
        }
    };

    /**
     * this function scans the background behind a sprite so that when the sprite
     * is drawn, the background isn't obliterated
     * @param sprite
     */
    my.SPR_BehindSprite = function(sprite) {

        var work_back;
        var work_offset=0,offset,y;
        var byte_SPRITE_WIDTH = sprite.width << 2;
        // alias a pointer to sprite background for ease of access
        work_back = sprite.background.buffer;

        // compute offset of background in video buffer
        offset = (sprite.y * my.byteMainBufferWidth) + (sprite.x << 2); // sprite.x converted to bytes

        for (y=0; y< sprite.height; y++)
        {
            // copy the next row out off screen buffer into sprite background buffer
            my.memcpy(work_back, work_offset, my.mainBuffer, offset , byte_SPRITE_WIDTH);

            // move to next line in video buffer and in sprite background buffer
            offset      += my.byteMainBufferWidth;
            work_offset += byte_SPRITE_WIDTH;

        } // end for y
    };

    /**
     * this function draws a sprite on the screen checks for 0 and if found does not draw
     * @param sprite - sprite object to draw - the frame drawn depends on the sprite.curr_frame value
     */
    my.SPR_DrawSprite = function(sprite) {

        var work_img;
        var work_offset=0,offset,x,y;
        var data;

        // get a pointer to frame img buffer
        work_img = sprite.frames[sprite.curr_frame];

        // compute offset of sprite in video buffer
        offset = (sprite.y * 320) + sprite.x;

        for (y=0; y<sprite.height; y++)
        {
            for (x=0; x<sprite.width; x++)
            {
                // test for transparent pixel i.e. 0, if not transparent then draw
                data=work_img[work_offset+x];
                if (data) {
                    my.rgbView[offset+x] = data; // 32 bit buffer
                }
            }

            // move to next line in video buffer and in sprite bitmap buffer
            offset      += my.mainBufferWidth;
            work_offset += sprite.width;
        }
    };

    return my;
}(PIX));




// G L O B A L S  ////////////////////////////////////////////////////////////
  /*
var MAX_SPRITE_FRAMES = 24;
var SPRITE_DEAD = 0;
var SPRITE_ALIVE = 1;
var SPRITE_DYING = 2;

// declared in image.js
var sprite.width = 32;
var sprite.height = 32;
var byte_SPRITE_WIDTH = sprite.width * 4; // 4 bytes per pixel.
                                              */
/**
 * This function initializes a sprite with the sent data
 *
 * @param x
 * @param y
 * @param ac
 * @param as
 * @param mc
 * @param ms
 */
var spriteFactory = function(x,y,ac,as,mc,ms)
{
    var index, sprite;
    sprite = {
        x            : x,
        y            : y,
        x_old        : x,
        y_old        : y,
        x_tile       : (x >> 5),
        y_tile       : (y >> 5),
        width        : sprite.width,
        height       : sprite.height,
        anim_clock   : ac,
        anim_speed   : as,
        motion_clock : mc,
        motion_speed : ms,
        curr_frame   : 0,
        state        : SPRITE_DEAD,
        num_frames   : 0,
        background   : new Uint32Array(SPRITE_WIDTH * sprite.height), //32 bit so use normal sprite.width
        frames: []
    };

    return sprite;
};




/**
 * this function draws a sprite on the screen checks for 0 and if found does not draw
 * @param sprite - sprite object to draw - the frame drawn depends on the sprite.curr_frame value
 */
var drawSprite = function(sprite) {

    var work_img;
    var work_offset=0,offset,x,y;
    var data;

    // get a pointer to frame img buffer
    work_img = sprite.frames[sprite.curr_frame];

    // compute offset of sprite in video buffer
    offset = (sprite.y * 320) + sprite.x;

    for (y=0; y<SPRITE_HEIGHT; y++)
    {
        for (x=0; x<SPRITE_WIDTH; x++)
        {
            // test for transparent pixel i.e. 0, if not transparent then draw
            data=work_img[work_offset+x];
            if (data) {
                RGB_VIEW[offset+x] = data; // 32 bit buffer
            }
        }

        // move to next line in video buffer and in sprite bitmap buffer
        offset      += _mainBufferWidth;
        work_offset += sprite.width;
    }
};


/**
 * this function scans the background behind a sprite so that when the sprite
 * is drawn, the background isn't obliterated
 * @param sprite
 */
var behindSprite = function(sprite) {

    var work_back;
    var work_offset=0,offset,y;

    // alias a pointer to sprite background for ease of access
    work_back = sprite.background.buffer;

    // compute offset of background in video buffer
    offset = (sprite.y * byte_SCREEN_WIDTH) + (sprite.x * 4); // sprite.x converted to bytes

    for (y=0; y<SPRITE_HEIGHT; y++)
    {
        // copy the next row out off screen buffer into sprite background buffer
        memcpy(work_back, work_offset, VIDEO_BUFFER, offset , byte_SPRITE_WIDTH);

        // move to next line in video buffer and in sprite background buffer
        offset      += byte_SCREEN_WIDTH;
        work_offset += byte_SPRITE_WIDTH;

    } // end for y
};

/**
 * this function replaces the background that was saved from where a sprite
 * was going to be placed
 * @param sprite
 */
var eraseSprite = function(sprite) {

    //replace the background that was behind the sprite
    var work_back;
    var work_offset=0,offset,y;

    // alias a pointer to sprite background for ease of access
    work_back = sprite.background.buffer;

    // compute offset of background in video buffer
    offset = (sprite.y * byte_SCREEN_WIDTH) + (sprite.x * 4); //sprite x converted to bytes

    for (y=0; y<SPRITE_HEIGHT; y++)
    {
        // copy the next row out off screen buffer into sprite background buffer
        memcpy(VIDEO_BUFFER,offset,work_back,work_offset,byte_SPRITE_WIDTH);

        // move to next line in video buffer and in sprite background buffer
        offset      += byte_SCREEN_WIDTH;
        work_offset += byte_SPRITE_WIDTH;
    }
};



/*

 unsigned char Get_Pixel(int x,int y);

 int Sprite_Collide(sprite_ptr sprite_1, sprite_ptr sprite_2);


 /* all canvas pixel data is a uint8clamped array */
