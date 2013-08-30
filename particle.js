/**
 * todo: what's going on with that time_scale thing?? must be a typedef?
 */



/**
 * Created with JetBrains WebStorm.
 * User: james
 * Date: 23/08/13
 * Time: 11:09
 * To change this template use File | Settings | File Templates.
 */

"use strict";


var PIX = (function (my) {

    var active_particles = 0 | 0;
    var particles = [];  // this maybe needs looking at
    var time_scale;
    // particle_t particles[MAX_PARTICLES]; // an array of particle_types with MAX_PARTICLES elements

    var AddParticle = function(particle)
    {
        /* If there are already too many particles, forget it. */
        if (active_particles >= MAX_PARTICLES)
            return;

        particles[active_particles] = particle;
        active_particles++;
    };

    /* Removes a particle from the system (by index). */
    var DeleteParticle = function(index)
    {
        /* Replace the particle with the one at the end
         of the list, and shorten the list. */
        particles[index] = particles[active_particles - 1];
        active_particles--;
    };


    /* ----------------- factory for 'particle' type ------------------ */
    my.PART_NewParticle = function(x,y,energy,angle,r,g,b) {
        var particle_type = {
            x: x,
            y: y,     /* coordinates of the particle (double) */
            energy: energy,/* velocity of the particle (double) */
            angle: angle, /* angle of the particle (double) */
            r: r,     /* color (int) */
            g: g,     /* color (int) */
            b: b      /* color (int) */
        };
        return particle_type;
    };

    /**
     *  Draws all active and visible particles to the given surface.
     */
    my.PART_DrawParticles = function(dest, camera_x, camera_y) {
        var i;
        var pixels;

        pixels =  dest.data; // get the surface data buffer?

        for (i = 0; i < active_particles; i++) {
            var x, y;
            var color; // ensure this is a 4 byte value

            /* Convert world coords to screen coords. */
            x = (particles[i].x - camera_x) | 0;
            y = (particles[i].y - camera_y) | 0;
            if ((x < 0) || (x >= SCREEN_WIDTH))
                continue;
            if ((y < 0) || (y >= SCREEN_HEIGHT))
                continue;

            /* Find the color of this particle. */
            // not sure about this as yet
            color = 0xFFFFFFFF;// CreateHicolorPixel(particles[i].r, particles[i].g, particles[i].b);

            /* Draw the particle. */
            pixels[(dest.width << 2 /*bear in mind pix/byte conversion*/ * y) + x] = color;
        }

    };

    /**
     *  Updates the position of each particle in the system, and removes particles
     *  that have lost their energy. This should typically be called once per frame.
     */
    my.PART_UpdateParticles = function() {
        var i;

        for (i = 0; i < active_particles; i++) {
            particles[i].x += particles[i].energy * Math.cos(particles[i].angle * Math.PI / 180.0); // * time_scale;
            particles[i].y += particles[i].energy *-Math.sin(particles[i].angle * Math.PI / 180.0); // * time_scale;

            /* Fade the particle's color. */
            particles[i].r--;
            particles[i].g--;
            particles[i].b--;
            if (particles[i].r < 0)
                particles[i].r = 0;
            if (particles[i].g < 0)
                particles[i].g = 0;
            if (particles[i].b < 0)
                particles[i].b = 0;

            /* If the particle has faded to black, delete it. */
            if ((particles[i].r + particles[i].g + particles[i].b) == 0) {
                DeleteParticle(i);

                /* DeleteParticle replaces the current particle with the one
                 at the end of the list, so we'll need to take a step back. */
                i--;
            }
        }
    };

    /**
     *  Creates a particle explosion at the given (x,y) position in the world. Sets each
     *  particle to the given (r,g,b) color and assigns each a random energy less than the
     *  given value. Creates a number of particles proportional to the given density factor.
     */
    my.PART_CreateParticleExplosion = function(x, y, r, g, b, energy, density) {
        var i;
        var particle =  my.PART_NewParticle();

        /* Create a number of particles proportional to the size of the explosion. */
        for (i = 0; i < density; i++) {

            particle.x = x;
            particle.y = y;
            particle.angle = Math.random() * 360 | 0;
            particle.energy = (Math.random() * (energy * 1000)) / 1000.0;

            /* Set the particle's color. */
            particle.r = r;
            particle.g = g;
            particle.b = b;

            /* Add the particle to the particle system. */
            AddParticle(particle);
        }
    };

    /*
     // This is directly from another code listing. It creates a 16-bit pixel.
    static Uint16 CreateHicolorPixel(SDL_PixelFormat * fmt, Uint8 red,
        Uint8 green, Uint8 blue)
    {
        Uint16 value;

        /* This series of bit shifts uses the information from the SDL_Format
         structure to correctly compose a 16-bit pixel value from 8-bit red,
         green, and blue data. *
        value = (((red >> fmt->Rloss) << fmt->Rshift) +
            ((green >> fmt->Gloss) << fmt->Gshift) +
            ((blue >> fmt->Bloss) << fmt->Bshift));

        return value;
    }
     */


    return my;
}(PIX));
