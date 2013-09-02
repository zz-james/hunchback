/**
 * Project: hunchback
 * User: james
 * Date: 02/09/13
 * Time: 18:54
 */
"use strict";

var PIX = (function (my) {
    var _tileWidth,_tileHeight,_rows,_cols;
    var _tiles;
    var _byteTileWidth;

    var _tilesTotal;
    var _tilePerRow;  // number of VISIBLE tiles per row
    var _totalScroll; // in pixels?

    // to do - implement tile map loader
    var _tileMap = new Uint8Array(
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,4,4,1,2,3,4,4,4,0,0,0,0,0,0,0,0,0,0,0,4,1,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,5,4,4,4,5,4,4,4,4,0,0,0,0,0,0,4,6,4,0,0,0,0,4,5,4,4,1,2,2,3,4,4,1,2,3,4,4,0,0,0,0,0,0,4,6,4,5,5,5,4,6,4,4,4,4,0,0,0,0,0,0,0,0,0,
         4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,6,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,1,2,2,3,4,4,4,4,4,6,4,4,4,4,4,6,4,4,4,5,4,5,4,4,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,0,0,
         4,4,4,4,4,4,6,4,4,4,4,4,1,2,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,4,4,4,4,1,2,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,2,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0
        ]
    );

    my.TILESCR_Init = function(tiles,width,height,rows,cols) {
        _tiles = tiles;
        _tileWidth = width;
        _tileHeight = height;
        _rows = rows;
        _cols = cols;
        _byteTileWidth = width << 2;
        _tilesTotal = rows * cols;
        _tilePerRow = my.mainBufferWidth / width;
        _totalScroll = (cols * width) - my.mainBufferWidth;
    };

    /**
     * draws a screen full of tiles.
     * @param xPos is the left corner x location within the 'virtual screen'.
     * @param startY is the row to begin drawing from
     */
    my.TILESCR_DrawTiles = function(xPos,startY)
    {
        var counter, xcoord, index, offset, row, limit;

        // get index of first visible tile
        index = (xPos / 32) | 0;			// gives number of 32 bit blocks
        offset = (xPos - index * 32) | 0;	// the remainder pixels
        limit = _tilePerRow;			        // 10

        //  if(offset == 0){limit--;}			    // limit now 9.

        for(row = startY; row < startY + (_tileHeight * _rows); row += _tileHeight)   // looping ROWS i.e. vertical
        {
            xcoord = _tileWidth - offset;

            // draw the leftmost tile
            // of the current row.
            // may be a partial tile
            if (_tileMap[index] != 0)  {
                my.TILESCR_DrawTile(_tiles.frames[_tileMap[index]].buffer, 0, row, offset, _tileWidth-offset);
            }

            // draw the rest of the tiles in the middle
            for(counter=index+1; counter<index+limit; counter++)
            {
                // draw the next tile on the current row; always a full tile.
                if (_tileMap[counter] != 0)  {
                    my.TILESCR_DrawTile(_tiles.frames[_tileMap[counter]].buffer, xcoord, row, 0, _tileWidth);
                }
                xcoord += _tileWidth;
            }

            // draw right-most tile of the current row
            // (may be a partial tile)
            if (_tileMap[counter] != 0)  {
                my.TILESCR_DrawTile(_tiles.frames[_tileMap[counter]].buffer, xcoord, row, 0, offset);
            }
            index += _cols;
        }
    };


    my.TILESCR_DrawTile = function(bmp_buf, x, y, offset, width)
    {
        var counter;

        x = x << 2;                       // convert from pixels to bytes
        offset = offset << 2;           // convert from pixels to bytes
        width = width << 2;             // convert from pixels to bytes

        //if(bmp == NULL) {return;} 	// don't draw empty tiles
        var destOffset = 0;            // calc offset in memory buf.
        var srcOffest = 0;

        // draw each scanline of the bit map
        for(counter=0;counter<_tileHeight;counter++)
        {
            my.memcpy(my.mainBuffer, ((y * my.byteMainBufferWidth) + x) + destOffset , bmp_buf, offset + srcOffest, width);
            destOffset += my.byteMainBufferWidth;
            srcOffest += _byteTileWidth;
        }

    };

    return my;
}(PIX));