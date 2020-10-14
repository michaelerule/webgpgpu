/** 
 * GL Canvas initialization
 */
function init_webgl_canvas(name) {
    name = name || "game_canvas";
    // Retrieve a handle to the canvas element
    var canvas = document.getElementById(name);
    // Try to create a WebGL context on the canvas, abort if it fails
    var gl = getRasterGL(canvas);
    if (!gl) OUT; 
    canvas.gl = gl;
    return canvas;
}

/** 
 * Bind our example fragment shader as a function
 * The parameters.js routines simplify passing parameters to the shader. 
 * Some parameters can be passed when we compile the shader (as #defines),
 * and others can be passed later as sampler or uniform parameters. The function
 * "compile_bind" generates the header text, with the appropriate #defines and
 * parameter declarations.
 */
function bind_basic_program(gl,params,name) {
    name   = name  || "basic_program";
    params = params||{game_w_px: game_w_px, game_h_px: game_h_px};
    basic_program = buildRasterProgram(gl,compile_bind(
        get_parameters(name + "_parameters"), params)[0]+$(name).text);
}

/** 
 * Bind our example fragment shader as a function
 * The parameters.js routines simplify passing parameters to the shader. 
 * Some parameters can be passed when we compile the shader (as #defines),
 * and others can be passed later as sampler or uniform parameters. The function
 * "compile_bind" generates the header text, with the appropriate #defines and
 * parameter declarations.
 */
function bind_program(gl,name,params) {
    return buildRasterProgram(gl,compile_bind(
        get_parameters(name + "_parameters"), params)[0]+$(name).text);
}

/**
 * Build a texture based on image data
 * image must be a square Javascript Image object
 * returns a texture object associated with WebGL context gl
 */
function pixel_art_texture(gl,image) {
    // Example via msdn.microsoft.com/en-us/library/dn385805(v=vs.85).aspx
    // Create a texture object that will contain the image.
    var texture = gl.createTexture();
    // Bind the texture the target (TEXTURE_2D) of the active texture unit.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Flip the image's Y axis to match the WebGL texture coordinate space.
    // Note: this is apparently deprecated
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    // Set the parameters so we can render any size image.        
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); 
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // Upload the resized canvas image into the texture.
    // Note: a canvas is used here but can be replaced by an image object. 
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    //gl.generateMipmap(gl.TEXTURE_2D);
    return texture;
}

/**
 * Get a new framebuffer (default: size of game)
 * with nearest neighbor interpolation
 */
function pixel_art_buffer(gl,w,h) {
    w = w || game_w_tiles;
    h = h || game_h_tiles;
    return newBasicFramebuffer(gl,{W:w, H:h, wrap:gl.CLAMP_TO_EDGE, 
        mag_filter:gl.NEAREST, min_filter:gl.NEAREST});
}

/**
 * Create tile shader program developed in the "hello tiles" example
 * @param gl {WebGL context}
 * @param game_w_tiles {int} - Game width in tiles
 * @param game_h_tiles {int} - Game height in tiles
 * @param tile_w_px {int} - Width of each tile
 * @param tile_h_px {int} - Height of each tile
 * @param tiles_across {int} - No. Tiles in each row of tile texture
 */
function get_tile_shader(gl,game_w_tiles,game_h_tiles,tile_w_px,tile_h_px,tiles_across,debug) {
    var tile_shader_parameters = `
    sampler2D tiles;
    sampler2D tile_ids;
    vec2  game_size;
    vec2  screen_size;
    vec2  texture_size;
    vec2  tile_size;
    vec2  select;
    float tiles_across;
    vec3  view_transform;`;

    var tile_shader_source = "";
    tile_shader_source += "#define DEBUG "+(debug? "true" : "false")+"\n";

    tile_shader_source += `
    #define RED    vec4(1.0,0.0,0.0,0.0)
    #define GREEN  vec4(0.0,1.0,0.0,0.0)
    #define BLUE   vec4(0.0,0.0,1.0,0.0)
    #define VIOLET vec4(1.0,0.0,1.0,0.0)
    void main() {
        // Transform from screen coordinates to game pixel coordinates
        vec2 p = gl_FragCoord.xy*view_transform.z + view_transform.xy;
        //gl_FragColor = vec4(0.2,0.2,0.2,0.0);
        if (!DEBUG) {
            // Exit if coordinate is not inside visible game region
            if (p.x<0.0||p.y<0.0||p.x>screen_size.x||p.y>screen_size.y) return;
        }
        // Get tile info: use red channel to decode a tile ID from 0-255
        // (Manually compute nearest-neighbor in texture for consistency)
        vec2  p2 = (floor(p/tile_size)+0.5)/(game_size);
        float id = 255.0-floor(texture2D(tile_ids,p2).r*255.0);
        // Convert tile ID to tile position in texture
        vec2 txy = vec2(mod(id,tiles_across),floor(id/tiles_across));
        // Calculate pixel offset into the tile
        vec2 tdelta = floor(mod(p,tile_size));
        // Coordinates are a bit weird, fix this.
        txy.x = tiles_across-1.0-txy.x;
        // This is our tile pixel lookup in pixels
        vec2 w = txy*tile_size + tdelta;
        // Divide by texture size to get correct coordinate
        gl_FragColor = texture2D(tiles,w/(float(tiles_across)*tile_size));
        if (DEBUG) {
            // Render a 1 pixel grid at both game and screen scales
            // Shade game pixels at the edge of each tile
            vec2 o = floor(mod(p,tile_size));
            if (o.x==0.0||o.y==0.0)
                gl_FragColor = (VIOLET+gl_FragColor)*0.5;
            if (o.x==tile_size.x-1.0||o.y==tile_size.y-1.0)
                gl_FragColor = (BLUE+gl_FragColor)*0.5;
            vec2 q = gl_FragCoord.xy;
            if (mod(q.x,2.0)!=mod(q.y,2.0)) {
                // Shade screen pixels at the edge of each tile
                // Depending on scale, sctsz can take on fractional values
                vec2 sctsz = tile_size/view_transform.z;
                // Start of each screen tile
                o = floor(mod(q+view_transform.xy/view_transform.z,sctsz));
                if (o.x==0.0||o.y==0.0) gl_FragColor = GREEN;
                // End of each screen tile
                o = floor(mod(q+1.0+view_transform.xy/view_transform.z,sctsz));
                if (o.x==0.0||o.y==0.0) gl_FragColor = RED;
            }
            if (p.x<0.0||p.y<0.0||p.x>=screen_size.x||p.y>=screen_size.y) gl_FragColor*=0.25;
        }
        vec2 r = floor(p/tile_size);
        if (r.x==floor(select.x)&&r.y==floor(select.y)) gl_FragColor=1.0-gl_FragColor;
    }`;
    
    var game_w_px = game_w_tiles*tile_w_px;
    var game_h_px = game_h_tiles*tile_h_px;
    var params = {
        game_size   :[game_w_tiles,game_h_tiles],
        tile_size   :[tile_w_px   ,tile_h_px   ],
        screen_size :[game_w_px   ,game_h_px   ],
        tiles_across:tiles_across};
    var args    = parse_parameters(tile_shader_parameters);
    var header  = compile_bind(args, params)[0];
    var program = header+tile_shader_source;
    var tile_shader = buildRasterProgram(gl,program);
    return tile_shader;
}
