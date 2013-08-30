/**
 * Project: hunchback
 * User: james
 * Date: 30/08/13
 * Time: 15:03
 */
"use strict";

var TILE_SHEET;
var TILES;
var screen;
var robopunk;
var BG;

/* --------------- FUNCTIONS / HANDLERS ETC ---------------- */

/**
 * kick things off.
 * need this hoisted I think
 */
function ready()
{
    /* Fire up PIX. */
    if (PIX.SURF_Init(document.getElementById('canvas'),640,480) < 0) {
        throw "Unable to initialize SDL";
    }

    /* Save the screen pointer for later use. */
    screen = PIX.SURF_GetMainSurface();

    /* Set the color key on the ship animation strip to black.
     Enable RLE acceleration for a performance boost. */
    //SDL_SetColorKey(tmp, SDL_SRCCOLORKEY|SDL_RLEACCEL, 0);

    /* Load the game's data into globals. */
    LoadGameData();   //hmmmm tail call.....
}

/**
 * Loads the game's resources. Exits the program on failure.
 */
var LoadGameData = function() {

    TILE_SHEET = PIX.SURF_NewSurface();  /* rotating ship in 2-degree increments */

    /* The player's ship is stored as a 8640x96 image.
     This strip contains 90 individual images of the ship, rotated in
     four-degree increments. Take a look at fighter.bmp in an image
     viewer to see exactly what this means. */
    PIX.IMG_QueueImage(TILE_SHEET,"ROBOPUNK.png");
    PIX.IMG_QueueImage(BG,"backgroound.png");

    PIX.IMG_LoadImages(onImagesLoaded);

};

var onImagesLoaded = function() {

    initBackground();
    initPlayer();
    //InitOpponent();

    PIX.SURF_FreeSurface(TILE_SHEET); // free up this memory

    mainLoop();
};

var initPlayer = function() {
    // create a sprite for robopunk
    robopunk = PIX.SPR_NewSprite(0,0,0,0,0,0);

    // extract animation cells for robopunk
    PIX.SPR_GrabBitmap(TILE_SHEET,robopunk,0,3,0);
    PIX.SPR_GrabBitmap(TILE_SHEET,robopunk,1,5,0);
    PIX.SPR_GrabBitmap(TILE_SHEET,robopunk,2,4,0);
    PIX.SPR_GrabBitmap(TILE_SHEET,robopunk,3,5,0);
    PIX.SPR_GrabBitmap(TILE_SHEET,robopunk,4,6,0);
    PIX.SPR_GrabBitmap(TILE_SHEET,robopunk,5,1,0);
    PIX.SPR_GrabBitmap(TILE_SHEET,robopunk,6,2,0);
    PIX.SPR_GrabBitmap(TILE_SHEET,robopunk,7,1,0);
    PIX.SPR_GrabBitmap(TILE_SHEET,robopunk,8,0,0);
};

var initBackground = function() {
    var index;
    TILES = PIX.TIL_NewTile(32,32,1,6);

    // extract background cells
    for (index=0; index<8; index++)
    {
        PIX.TIL_GrabBitmap(TILE_SHEET,TILES,index,index,1);
    } // end for index
};

/**
 * this is the game loop
 */
var mainLoop = function() {
    // erase robopunk
    PIX.SPR_EraseSprite(robopunk);

    /* Grab a snapshot of the keyboard. */
    var pressed = PIX.KEY_GetKeyState();

    // has the user pressed a key?
    if(pressed.length)
    {
        // test what key was pressed
        if(pressed[39]){
            checkCollisions((POS+32)>>5); // this expression yeilds x component for tilemap look up
            //TILE_MAP[((POS+32) >>5 )] != 4
            (POS  += 8) | 0;

            if(POS > TOTAL_SCROLL)
            {
                POS = TOTAL_SCROLL;
            } else {
                BACK_POS -= 1;						// scroll BACK_POS left
                // one pixel
                if(BACK_POS < 1) 	   				// did we read the end??
                    BACK_POS += SCREEN_WIDTH;		// yes, wrap around
            }
            // advance the animation frame and move player
            // test if player is moving left, if so
            // show player turning before moving

            if (robopunk.curr_frame > 4)
            {
                robopunk.curr_frame = 0;
            } // end if player going right
            else
            if (robopunk.curr_frame == 0 )
                robopunk.curr_frame =1;
            else
            {
                // player is already in rightward motion so continue

                if (++robopunk.curr_frame > 4)
                    robopunk.curr_frame = 1;

            } // end else


        }

        if(pressed[37]) {
            (POS  -= 8) | 0;
            if(POS < 0)
            {
                POS = 0;
            } else {
                BACK_POS += 1;						// scroll BACK_POS right
                // one pixel
                if(BACK_POS > SCREEN_WIDTH - 1)		// reach end??
                    BACK_POS -= SCREEN_WIDTH;		// yes, wrap around
            }
            // advance the animation frame and move player
            // test if player is moving right, if so
            // show player turning before moving
            if (robopunk.curr_frame > 0 && robopunk.curr_frame < 5)
            {
                robopunk.curr_frame = 0;
            }
            else if (robopunk.curr_frame == 0 )
            {
                robopunk.curr_frame = 5;
            }
            else
            {
                // player is already in leftward motion so continue
                if (++robopunk.curr_frame > 8)
                {
                    robopunk.curr_frame = 5;
                }

            } // end else
            //console.log( TILE_MAP[((POS+8) >>5 )] );
        }

        if(pressed[81]) {
            // the user is exiting
            console.log('quitting');
            done = 1;
        }
    }

    PIX.LAY_DrawLayers(); // draw parallax layer(s) in RGB_VIEW

    // scan background under robopunk

    PIX.SPR_BehindSprite(robopunk);

    // draw him
    PIX.SPR_DrawSprite(robopunk);

    // update canvas buffer and write to screen
    // IMAGE_DATA.data.set(CANVAS_VIEW);
    // CTX.putImageData(IMAGE_DATA, 0, 0);
    PIX.SURF_Flip();

    /* end main loop body */
    if(!done)
    {requestAnimFrame(mainLoop);}
    else
    {/* exit loop */ console.log("done");}

};