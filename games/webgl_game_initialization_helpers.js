/** 
 * GL Canvas initialization
 */
function init_webgl_canvas() {
    // Retrieve a handle to the canvas element
    canvas = document.getElementById("game_canvas");
    // Try to create a WebGL context on the canvas, abort if it fails
    var gl = getRasterGL(canvas);
    if (!gl) OUT; 
    return gl;
}

/** 
 * Bind our example fragment shader as a function
 * The parameters.js routines simplify passing parameters to the shader. 
 * Some parameters can be passed when we compile the shader (as #defines),
 * and others can be passed later as sampler or uniform parameters. The function
 * "compile_bind" generates the header text, with the appropriate #defines and
 * parameter declarations.
 */
function bind_basic_program(params,name) {
    name   = name  || "basic_program";
    params = params||{
        game_w_px: game_w_px, 
        game_h_px: game_h_px};
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
function bind_program(name,params) {
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
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
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
 * Create tile shader program developed in the "hello tiles" example
 * @param gl {WebGL context}
 * @param game_w_tiles {int} - Game width in tiles
 * @param game_h_tiles {int} - Game height in tiles
 * @param tile_w_px {int} - Width of each tile
 * @param tile_h_px {int} - Height of each tile
 * @param tiles_across {int} - No. Tiles in each row of tile texture
 */
function get_tile_shader(gl,game_w_tiles,game_h_tiles,tile_w_px,tile_h_px,tiles_across,debug) {
    var tile_shader_parameters =
     "sampler2D tiles;\n"
    +"sampler2D tile_ids;\n"
    +"vec2  game_size;\n"
    +"vec2  screen_size;\n"
    +"vec2  texture_size;\n"
    +"vec2  tile_size;\n"
    +"float tiles_across;\n"
    +"vec3  view_transform;";

    var tile_shader_source = "";
    if (debug)
        tile_shader_source+="#define DEBUG  true\n";
    else
        tile_shader_source+="#define DEBUG  false\n";

    tile_shader_source += 
     "#define RED    vec4(1.0,0.0,0.0,0.0)\n"
    +"#define GREEN  vec4(0.0,1.0,0.0,0.0)\n"
    +"#define BLUE   vec4(0.0,0.0,1.0,0.0)\n"
    +"#define VIOLET vec4(1.0,0.0,1.0,0.0)\n"
    +"void main() {\n"
    +"    // Transform from screen coordinates to game pixel coordinates\n"
    +"    vec2 q = gl_FragCoord.xy;\n"
    +"    vec2 p = gl_FragCoord.xy*view_transform.z + view_transform.xy;\n"
    +"    // Exit if coordinate is not inside visible game region\n"
    +"    gl_FragColor = vec4(0.2,0.2,0.2,0.0);\n"
    +"    if (p.x<0.0||p.y<0.0||p.x>screen_size.x||p.y>screen_size.y) return;\n"
    +"    // Get tile info: use red channel to decode a tile ID from 0-255\n"
    +"    float id = 255.0-floor(texture2D(tile_ids,p/screen_size).r*255.0);\n"
    +"    // Convert tile ID to tile position in texture\n"
    +"    vec2 txy = vec2(mod(id,tiles_across),floor(id/tiles_across));\n"
    +"    // Calculate pixel offset into the tile\n"
    +"    vec2 tdelta = floor(mod(p,tile_size));\n"
    +"    // Coordinates are a bit weird, fix this.\n"
    +"    txy.x = tiles_across-1.0-txy.x;\n"
    +"    // This is our tile pixel lookup in pixels\n"
    +"    vec2 w = txy*tile_size + tdelta;\n"
    +"    // Divide by texture size to get correct coordinate\n"
    +"    gl_FragColor = texture2D(tiles,w/(float(tiles_across)*tile_size));\n"
    +"    if (DEBUG) {\n"
    +"        // Render a 1 pixel grid at both game and screen scales\n"
    +"        // Shade game pixels at the edge of each tile\n"
    +"        vec2 o = floor(mod(p,tile_size));\n"
    +"        if (o.x==0.0||o.y==0.0)\n"
    +"            gl_FragColor = (VIOLET+gl_FragColor)*0.5;\n"
    +"        if (o.x==tile_size.x-1.0||o.y==tile_size.y-1.0)\n"
    +"            gl_FragColor = (BLUE+gl_FragColor)*0.5;\n"
    +"        if (mod(q.x,2.0)!=mod(q.y,2.0)) {\n"
    +"            // Shade screen pixels at the edge of each tile\n"
    +"            // Depending on scale, sctsz can take on fractional values\n"
    +"            vec2 sctsz = tile_size/view_transform.z;\n"
    +"            // Start of each screen tile\n"
    +"            o = floor(mod(q+view_transform.xy/view_transform.z,sctsz));\n"
    +"            if (o.x==0.0||o.y==0.0) gl_FragColor = GREEN;\n"
    +"            // End of each screen tile\n"
    +"            o = floor(mod(q+1.0+view_transform.xy/view_transform.z,sctsz));\n"
    +"            if (o.x==0.0||o.y==0.0) gl_FragColor = RED;\n"
    +"        }\n"
    +"        if (p.x<0.0||p.y<0.0||p.x>=screen_size.x||p.y>=screen_size.y) gl_FragColor*=0.25;\n"
    +"    }\n"
    +"}\n";
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
