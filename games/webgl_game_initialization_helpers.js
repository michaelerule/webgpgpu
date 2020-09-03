
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
