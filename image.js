/**
 * Project: Canvas Sprite Blitter
 * User: James
 * Date: 08/05/13
 * Time: 20:18
 */
"use strict";


var PIX = (function (my) {

    var _D_bufferDataContainer = [];
    var _numImgs;
    var _numLoadedImgs = 0;
    var _callback;
    var _D_tmpImg = new Image(); // just have this image pointer in heap

    my.IMG_QueueImage = function (surface, url) {
        //check if 'surface' is actually a valid
        if (!surface.hasOwnProperty('surface')) {
           throw "not a valid surface object please ensure the surface is properly initialised using IMG_NewSurface";
        }

        var D_img = new Image();

        D_img.onload = function(e) {

            _numLoadedImgs++;
            if(_numLoadedImgs === _numImgs) {
                putImageDataInBuffer();
                _callback();
            }
        };

        D_img.onerror = function(e) {
            throw "there was an error loading "+ e.currentTarget.name;
        };

        D_img.name = url;    // when we load we'll set src = name
        _D_bufferDataContainer.push({buffer:surface, image: D_img});
        _numImgs = _D_bufferDataContainer.length;

    };

    /**
     * itterate over list of buffer objects setting the src
     * property of the image objects which will trigger the download
     * @param callback ; the function to call when all the images are loaded
     */
    my.IMG_LoadImages = function(callback) {
        _callback = callback;
        for (var i = 0; i < _numImgs; i++) {
            _D_tmpImg = _D_bufferDataContainer[i].image;
            _D_tmpImg.src = _D_tmpImg.name;
            // setting src property triggers loading
        }
    };

    var putImageDataInBuffer = function() {

        var D_offscreen_canvas = document.createElement('canvas');
        var D_offscreen_context = D_offscreen_canvas.getContext('2d');

        for (var i = 0; i < _numImgs; i++) {
            _D_tmpImg = _D_bufferDataContainer[i].image;
            var width = _D_tmpImg.width;
            var height = _D_tmpImg.height;
            D_offscreen_canvas.width = width;
            D_offscreen_canvas.height = width;
            D_offscreen_context.drawImage(_D_tmpImg,0,0);
            _D_bufferDataContainer[i].buffer.img = _D_tmpImg;
            _D_bufferDataContainer[i].buffer.surface = D_offscreen_context.getImageData(0, 0, width, height);
        }
    };

    var IMG_AreWeDoneYet = function() {
        if(_numLoadedImgs === _numImgs) {
            return true;
        }
        return false;
    };

    return my;
}(PIX));





