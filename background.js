/**
 * Created with JetBrains WebStorm.
 * User: james
 * Date: 22/08/13
 * Time: 21:49
 * To change this template use File | Settings | File Templates.
 */
"use strict";

/* Dimensions of the game window. */
var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 480;

/* Number of particles allowed in the particle system. */
var MAX_PARTICLES = 10000;

/* Dimensions of the player's ship. The graphics data must correspond to this. */
var PLAYER_WIDTH = 96;
var PLAYER_HEIGHT = 96;

/* Dimensions of the map tiles. */
var TILE_WIDTH = 64;
var TILE_HEIGHT = 64;

/* Total size (in pixels) of the complete playfield. */
var WORLD_WIDTH = 2000;
var WORLD_HEIGHT = 2000;

/* Limits on the player. */
var PLAYER_MAX_VELOCITY = (15.0);
var PLAYER_MIN_VELOCITY	= (-5.0);

var PLAYER_FORWARD_THRUST = (3);
var PLAYER_REVERSE_THRUST = (-2);

/* These define the scrolling speeds of the front and back background
 layers, relative to the movement of the camera. */
var PARALLAX_BACK_FACTOR = 4;
var PARALLAX_FRONT_FACTOR = 2;

/* These define the sizes of the background tile grids. We don't really need a one to one
 mapping between the size of the playing field and the size of the tile grids;
 we can wrap around at some point, and nobody will notice a difference. */
var PARALLAX_GRID_WIDTH = 100;
var PARALLAX_GRID_HEIGHT = 100;

/* Two-dimensional arrays for storing the world's tiles (by index). */
var front_tiles = createArray(PARALLAX_GRID_WIDTH, PARALLAX_GRID_HEIGHT);
var back_tiles  = createArray(PARALLAX_GRID_WIDTH, PARALLAX_GRID_HEIGHT);

/**
 * Initializes the background drawing system.
 * sets up the starry background by assigning random tiles.
 * this should be called after LoadGameData().
 */
var initBackground = function(){
    var x, y;
   // initrandom();
    for (x = 0; x < PARALLAX_GRID_WIDTH; x++) {
        for (y = 0; y < PARALLAX_GRID_HEIGHT; y++) {
            front_tiles[x][y] = Math.random() * num_star_tiles | 0;
            back_tiles[x][y]  = Math.random() * num_star_tiles | 0;
        }
    }
};

/**
 *  Draws the background on the screen, with respect to the global
 *  'camera' position. The camera marks the 640x480 section of the
 *  world that we can see at any given time. This is usually in the
 *  vicinity of the player's ship.
 */
var DrawBackground = function(dest, camera_x, camera_y){
    var draw_x, draw_y;		/* drawing position on the screen */
    var start_draw_x, start_draw_y;

    var tile_x, tile_y;		/* indices in the back_tiles[][] array */
    var start_tile_x, start_tile_y;

    /* Map the camera position into tile indices. */
    start_tile_x = ((camera_x / PARALLAX_BACK_FACTOR) / TILE_WIDTH) % PARALLAX_GRID_WIDTH | 0; //int
    start_tile_y = ((camera_y / PARALLAX_BACK_FACTOR) / TILE_HEIGHT) % PARALLAX_GRID_HEIGHT | 0; //int

    start_draw_x = -((camera_x / PARALLAX_BACK_FACTOR) % TILE_WIDTH) | 0; //int
    start_draw_y = -((camera_y / PARALLAX_BACK_FACTOR) % TILE_HEIGHT) | 0; //int

    /* Use nested loops to scan down the screen, drawing rows of tiles. */
    tile_y = start_tile_y;
    draw_y = start_draw_y;
    while (draw_y < SCREEN_HEIGHT) {
        tile_x = start_tile_x;
        draw_x = start_draw_x;
        while (draw_x < SCREEN_WIDTH) {
            var srcrect = {}, destrect = {};

            srcrect.x = TILE_WIDTH * back_tiles[tile_x][tile_y];
            srcrect.y = 0;
            srcrect.w = TILE_WIDTH;
            srcrect.h = TILE_HEIGHT;

            destrect.x = draw_x - srcrect.x ;
            destrect.y = draw_y;
            destrect.w = TILE_WIDTH;
            destrect.h = TILE_HEIGHT;

            PIX.SURF_BlitCanvas(back_star_tiles.surface, srcrect, destrect);

            tile_x++;
            tile_x %= PARALLAX_GRID_WIDTH;
            draw_x += TILE_WIDTH;
        }
        tile_y++;
        tile_y %= PARALLAX_GRID_HEIGHT;
        draw_y += TILE_HEIGHT;
    }
};

/**
 * Same as above, but draws the upper (parallaxing) layer of the background.
 */
var DrawParallax = function(dest, camera_x, camera_y)
{
    var draw_x, draw_y;		/* drawing position on the screen */
    var start_draw_x, start_draw_y;

    var tile_x, tile_y;		/* indices in the back_tiles[][] array */
    var start_tile_x, start_tile_y;

    /* Map the camera position into tile indices. */
    start_tile_x = ((camera_x / PARALLAX_FRONT_FACTOR) / TILE_WIDTH) % PARALLAX_GRID_WIDTH | 0;
    start_tile_y = ((camera_y / PARALLAX_FRONT_FACTOR) / TILE_HEIGHT) % PARALLAX_GRID_HEIGHT | 0;

    start_draw_x = -((camera_x / PARALLAX_FRONT_FACTOR) % TILE_WIDTH) | 0;
    start_draw_y = -((camera_y / PARALLAX_FRONT_FACTOR) % TILE_HEIGHT) | 0;

    /* Use nested loops to scan down the screen, drawing rows of tiles. */
    tile_y = start_tile_y;
    draw_y = start_draw_y;
    while (draw_y < SCREEN_HEIGHT) {
        tile_x = start_tile_x;
        draw_x = start_draw_x;
        while (draw_x < SCREEN_WIDTH) {
            var srcrect = {}, destrect = {};

            srcrect.x = TILE_WIDTH * front_tiles[tile_x][tile_y];
            srcrect.y = 0;
            srcrect.w = TILE_WIDTH;
            srcrect.h = TILE_HEIGHT;
            destrect.x = draw_x - srcrect.x;
            destrect.y = draw_y;
            destrect.w = TILE_WIDTH;
            destrect.h = TILE_HEIGHT;

            PIX.SURF_BlitCanvas(front_star_tiles.surface, srcrect, destrect);

            tile_x++;
            tile_x %= PARALLAX_GRID_WIDTH;
            draw_x += TILE_WIDTH;
        }
        tile_y++;
        tile_y %= PARALLAX_GRID_HEIGHT;
        draw_y += TILE_HEIGHT;
    }
};


/* ---------------------- utility functions ---------------- */

/**
 * utility function for creating multidimentional arrays #
 * usage e.g. var arr = createArray(3, 2) => [new Array(2),new Array(2),new Array(2)]
 */
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}


