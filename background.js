/**
 * Created with JetBrains WebStorm.
 * User: james
 * Date: 22/08/13
 * Time: 21:49
 * To change this template use File | Settings | File Templates.
 */
"use strict";

var PIX = (function (my) {

    //      opaqueBlt(BACK_POS);
    //      drawTiles(POS,96);

    /**
     * this routine draws a infinite scrolling bit map layer
     * @param scrollSplit (int) defines the column that splits the bit map into two halves
     */
    my.BAC_opaqueBlt = function(scrollSplit)
    {

        var dstOffset = 0;
        var srcOffset = 0;
        scrollSplit = scrollSplit * 4; // convert scrollSplit to bytes
        var bgsurf = BG.surface.data.buffer;  // cache pointer to background image buffer in local before looping
        var bgwidth = BG.surface.width << 2;

        for(var counter = 0;  counter < my.mainBufferHeight;  counter++)
        {
            // draw the left bit map half in the right half of the memory buffer
            my.memcpy(my.mainBuffer, scrollSplit + dstOffset , bgsurf , srcOffset , (my.byteMainBufferWidth - scrollSplit) );

            // draw the right bit map half in the left half of the memory buffer
            my.memcpy(my.mainBuffer, dstOffset , bgsurf, (my.byteMainBufferWidth - scrollSplit) + srcOffset  , scrollSplit );
            srcOffset += bgwidth;
            dstOffset += my.byteMainBufferWidth;
        }
    };


    return my;
}(PIX));


