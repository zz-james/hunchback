/**
 * Project: Canvas Sprite Blitter
 * User: james
 * Date: 06/05/13
 * Time: 20:31
 */
"use strict";

var PIX = (function (my) {

    /**
     * creates typed array of Uint8s
     * assigned to TILE_MAP
     */
    my.TIL_ReadTileMap = function() {

    };

    /**
     * This function initializes a tile with the sent data
     * @param tile_width
     * @param tile_height
     * @param tile_state  - whether tile is (initially) walkable, ladder etc
     * @param num_tiles - the number of frames/states the tile can show
     * @returns {{width: *, height: *, curr_frame: number, state: *, num_frames: *, frames: Array}}
     * @constructor
     */
    my.TIL_NewTile = function(tile_width, tile_height, tile_state, num_tiles)
    {
        var tile = {
            width        : tile_width,
            height       : tile_height,
            curr_frame   : 0,
            state        : tile_state,
            num_frames   : num_tiles,
            frames: new Array()
        };

        return tile;
    };


    /**
     * This function will grab a bitmap from the picture object buffer. it uses the
     * convention that the surface is sub divided into a smaller
     * matrix of nxn adjacent squares of size tile.height X tile.width
     * @param surface - surface
     * @param tile - tile object
     * @param frame - index of 'frames' in the tile object
     * @param grab_x - x point in pixels to start grabbing from the picture buffer
     * @param grab_y - y point in pixels to start grabbing from the picture buffer
     */
    my.TIL_GrabBitmap = function(tilesheet, tile, frame, grab_x, grab_y) {
        var pixels = tilesheet.rgb;
        var sheet_width = tilesheet.surface.width;
        var x_off,y_off, x,y;
        var tile_data; // just a useful alias to array members
        var tile_height = tile.height; // cache property as a local
        var tile_width = tile.width;
        //var pix_tile_width = tile_width << 2; // tile width in pixels

        // first allocate the memory for the tile in the tile structure
        tile.frames[frame] = new Uint32Array(tile_width * tile_height);

        // create an alias to the tile frame for ease of access
        tile_data = tile.frames[frame];

        // now load the sprite data into the sprite frame array from the picture
        x_off = (tile_width+1)  * grab_x + 1;
        y_off = (tile_height+1) * grab_y + 1;

        // compute starting y address
        y_off = y_off * sheet_width;  // units are pixels not bytes as using Uint32Arrays

        for (y=0; y<tile_height; y++)
        {
            for (x=0; x<tile_width; x++)
            {
                // get the next byte of current row and place into next position in
                // tile frame data buffer
                //console.log(pixels[y_off + x_off + x]);
                tile_data[y*tile_width + x] = pixels[y_off + x_off + x];
            }
            // move to next line of picture buffer
            y_off+=sheet_width;
        }
        // increment number of frames
        tile.num_frames++;
    };

    return my;
}(PIX));






