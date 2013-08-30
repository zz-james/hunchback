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

    PIX.IMG_LoadImages(onImagesLoaded);

};

var onImagesLoaded = function() {

    var index;
    /* Determine how many star tiles are in the strip. We'll assume that the
     foreground and background strips contain the same number of stars. */
    //var num_star_tiles = back_star_tiles.surface.width / 64;

    //num_star_tiles = 4;
    TILES = PIX.TIL_NewTile(32,32,1,6);

    // extract background cells
    for (index=0; index<8; index++)
    {
        PIX.TIL_GrabBitmap(TILE_SHEET,TILES,index,index,1);
    } // end for index

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


    initBackground();

    /* Play! */
    InitPlayer();
    InitOpponent();
    PlayGame();
};