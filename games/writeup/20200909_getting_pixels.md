# Crisp pixel art rendering in WebGL

This post covers how to render a pixel-art tiled game environment in WebGL,
addressing the following technical issues: 

- Setting up a WebGL canvas
- Loading a texture of game tiles
- A shader program that renders pixelated game tiles without gaps/errors

This post is about details of WebGL, for those who enjoy coding for its own sake. If your aim is to develop a game, I recommend using a [game engine](https://en.wikipedia.org/wiki/WebGL#Game_engines) that handles all of this (and more) automatically. 

This code was tested on Firefox v. 80.0 and Chrome v. 85.0.4183.83. I tried to use only functionality supported by the WebGL 1.0, but didn't actually test this on other platforms, so things might break in some browsers.

# Overview of rendering approach

 - Screen pixels
 - WebGL pixels
 - Game pixels
 - Game tiles

# Setting up a WebGL canvas

 - Basic HTML stuff
 - Creating the webGL environment
 - Keeping scale consistent

# Loading a texture of game tiles

 - The cross-site permissions issue
 - Encoding a texture in base64 for local development
 - Use nearest-neightbor sampling and no mipmaps

# A shader program to render pixelated game tiles without gaps/errors

 - Calculate tile position and game pixel position in the shader
 - Sample from texture to fill in the data


