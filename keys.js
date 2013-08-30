/**
 * Project: canvas_sprite_blitter
 * User: james
 * Date: 23/08/13
 * Time: 16:56
 */
"use strict";

var PIX = (function (my) {

    var pressed={};

    document.onkeydown=function(e){
        e = e || window.event;
        pressed[e.keyCode] = true;
    };

    document.onkeyup=function(e){
        e = e || window.event;
        delete pressed[e.keyCode];
    };

    my.KEY_GetKeyState = function() {
        return pressed;
    };
    /* usage eg if(pressed[37]) {} */

    return my;
}(PIX));