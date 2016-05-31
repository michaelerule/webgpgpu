/**
 *  Shorthand for getElementById
 */
$ = function(id) { return document.getElementById(id); }

/**
 *
 */
function compileAndBindShader(gl,program,source,type){
    var shader = gl.createShader(type);
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Error compiling shader:\n" + source +
              "':\n\n" + gl.getShaderInfoLog(shader));
        return null;
    }
    gl.attachShader(program,shader);
    return shader;
}

/**
 * Initializes a default WebGL program for use in raster rendering.
 * This takes a 2D geometry, passed through parameter "p", and forwards
 * it to the gl_position variable, with the z coordinate set to 0 and the
 * 'w' coordinate (used for normalization in affine transforms) set to 1.
 * @param  {webgl context} gl - An HTML5 WebGL context
 * @return {webgl program}    - A WebGL program initialized with a default
 *                              vertex shader.
 */
function getDefaultRasterProgram(gl) {
    var program = gl.createProgram();
    compileAndBindShader(gl,program,
        "attribute vec2 p;"+
        "void main() {"+
        "    gl_Position=vec4(p,0,1);"+
        "}",
        gl.VERTEX_SHADER);
    return program;
}

/**
 * Activate default position argument for default vertex shader.
 * This will only work for programs created by getDefaultRasterProgram
 * that use the default vertex shader intended for raster rendering,
 * and use the variable name "p" for the vertex position variable.
 * See also getDefaultRasterProgram.
 * @param gl      {WebGL context} - HTML5 WebGL graphics context
 * @param program {WebGL program} - Program from getDefaultRasterProgram(gl)
 */
function activateVertexShaderPosition(gl,program) {
    gl.useProgram(program);
    // We also need to manually pass arguments to the shader
    // This tells us to forward vertex attributes to the variable
    // called p inside the vertex (geometry) shader
    var pointer = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(pointer);
    gl.vertexAttribPointer(
        pointer,  // index (pointer) to variable index (register)
        2,        // size (it's a 2-vector / tuple)
        gl.FLOAT, // type (floating point, medium precision)
        false,    // normalized (I guess we're not using this)
        0,        // stride (vector is tighly packed, no extra space)
        0);       // pointer (offest to beginning of vector)
    gl.useProgram(null);
}

/**
 * Create a callable fragment shader to simplify GPGPU programs
 *
 * Initialize a program with a specific vertex and fragment shader
 * For our purposes, we only ever render rasters to textures or
 * to screen, so we can take care of some of that boilerplate here.
 * @param gl {WebGL context}
 * @param fragment {str} - HTML identifier of script tag contianing shader
 * @param defines - optional list of variables to #define for the shader
 */
function getRasterProgram(gl,fragment,defines) {
    var program = getDefaultRasterProgram(gl);

    var source = "";
    source += "precision mediump float;\n"

    defines = defines||{};
    defines['W'] = defines['W'] || gl.width  || 256;
    defines['H'] = defines['H'] || gl.height || 256;
    for (k in defines) if (defines.hasOwnProperty(k))
        source += '#define '+k+' '+defines[k]+"\n";

    source += $(fragment).text
    compileAndBindShader(gl,program,source,gl.FRAGMENT_SHADER);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Could not initialise shader " + fragment);
        return null;
    }
    // Need to manually inform the vertex shader about the coordinates
    // This can only be done after the program as been compiled and linked
    // However, this function call relies on the program having been created
    // by getDefaultRasterProgram above.
    activateVertexShaderPosition(gl,program);
    program.gl = gl;
    function callable_program(inputs,output) {
        return applyProgram(program,inputs,output);
    }
    callable_program.program = program;
    return callable_program;
}

function bindTexture(gl,program,varname,index,texture) {
    if (index>=8) console.log(
        'Requested texture unit '+index+' but only units 0..7 are guaranteed '+
        'to exist on all implementations.');
    gl.useProgram(program);
    var pointer = gl.getUniformLocation(program, varname);
    gl.uniform1i(pointer, index);
    gl.activeTexture(gl.TEXTURE0+index);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.useProgram(null);
}

/**
 * Initialize a WebGL texture.
 * For some reason the OpenGL API is incredibly stateful. The normal method
 * for setting up a texture is to request a texture object, make this object
 * active, then call a bunch of commands that set texture parameters, then
 * clean up. This wrapper provides a more functional approach to initializing
 * textures, where all relevant configuration are passed as parameters. It
 * will initialize and bind the appropriate texture, and clean up the context
 * when done.
 * @param gl      {WebGL context} - HTML5 WebGL graphics context
 * @param params  {dictionary}    - Key->value mapping for texture parameters
 *                                  For now, see source for supported params.
 */
function newTexture(gl,params) {
    // Perform some validation and checking of arguments -- not all combinations
    // are permitted
    var W = params['size'] || params['width' ] || gl.width;// || 256;
    var H = params['size'] || params['height'] || gl.height;// || 256;
    var XEDGE = params['wrap_s'] || params['wrap'] || gl.CLAMP_TO_EDGE;
    var YEDGE = params['wrap_t'] || params['wrap'] || gl.CLAMP_TO_EDGE;
    if ( (H&(H-1))!=0 || (W&(W-1))!=0 ) {
        console.log('Warning: repeated textures must have power of two size');
        console.log('Ignoring repeat setting and clamping to edge');
        XEDGE = YEDGE = gl.CLAMP_TO_EDGE;
    }

    var texture = gl.createTexture();
    var target  = params['target'] || gl.TEXTURE_2D;
    gl.bindTexture(target, texture);
    gl.texParameteri(target,
        gl.TEXTURE_MAG_FILTER, params['mag_filter'] || gl.LINEAR);
    gl.texParameteri(target,
        gl.TEXTURE_MIN_FILTER, params['min_filter'] || gl.LINEAR);
    gl.texParameteri(target, gl.TEXTURE_WRAP_S,XEDGE);
    gl.texParameteri(target, gl.TEXTURE_WRAP_T,YEDGE);
    // remaining parameters set by texImage2D
    gl.texImage2D(target,
        params['level' ] || 0,
        params['format'] || gl.RGBA,
        W,H,0,
        params['format'] || gl.RGBA,
        params['type'  ] || gl.UNSIGNED_BYTE,
        params['pixels'] || null);
    gl.bindTexture(target, null);
    texture.width  = W;
    texture.height = H;
    return texture;
}

function bindColormap(gl,program,varname,index,data) {
    gl.useProgram(program);
    var pointer = gl.getUniformLocation(program, varname);
    gl.uniform1i(pointer, index);
    gl.activeTexture(gl.TEXTURE0 + index);
    // Create a 1D colormap texture and move it to the GPU
    colormap = newTexture(gl,{
        mag_filter: gl.LINEAR,
        min_filter: gl.LINEAR,
        wrap_s    : gl.CLAMP_TO_EDGE,
        wrap_t    : gl.CLAMP_TO_EDGE,
        width     : 256,
        height    : 1,
        pixels    : new Uint8Array(data.buffer)
    })
    gl.useProgram(null);
}

/**
 * Creates frame buffer with one RGBA texture serving as a rendering surface
 *
 * @param gl {WebGL context}
 * @param params - parameters to forward to texture. define at least width
 */
function newBasicFramebuffer(gl,params) {
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    var texture = newTexture(gl,params||{});
    // Put the new texture in this framebuffer
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture, 0);
    framebuffer.texture = texture;
    framebuffer.width  = texture.width ;
    framebuffer.height = texture.height;
    return framebuffer;
}

/**
 *
 */
function renderProgram(gl,program,framebuffer) {
    gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer||null);
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.useProgram(null);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
}



/**
 * Maps integers back to WebGL constant names.
 * The inverse mapping is cached which allows fast lookup of parameters
 * and types based on numeric values.
 * @param gl {WebGL context}
 * @param i {int} - integer you wish to map back to a WebGL constant name
 */
function glConstant(gl,i) {
    if (!gl.hasOwnProperty('__GL_CONSTANTS_MAP__')) {
        gl.__GL_CONSTANTS_MAP__ = {};
        for (k in gl) gl.__GL_CONSTANTS_MAP__[gl[k]] = k;
    }
    return gl.__GL_CONSTANTS_MAP__[i];
}

/**
 * Collects all the information needed to use a WebGL uniform in one place.
 *
 * The WebGL API is incredibly verbose. For GPGPU programming using shaders,
 * this makes code hard to read and debug. Instead, we set up a framework
 * so that GL shaders can be used more like ordinary functions. To do this,
 * we need to move all the details of locating and configuring shader
 * parameters (aka "uniforms") under the hood.
 */
function newParameter(gl,program,unif) {
    var param = {};
    param.name      = unif.name;
    param.type      = unif.type;
    param.size      = unif.size;
    param.typename  = glConstant(gl,param.type)
    param.shortname = param.name.split('[')[0];
    param.location  = gl.getUniformLocation(program,param.shortname);
    // find out the correct way to set this variable
    function tn(s){return param.typename.indexOf(s)>=0;};
    if (tn('SAMPLER')) {
        param.setname = "uniform1i";
        param.mode    = 'texture';
        param.set = function(texture,index){
            if (index>=8) console.log(
                'Requested texture unit '+index+' but only units 0..7 are '+
                'guaranteed to exist on all implementations.');
            gl.useProgram(program);
            gl.uniform1i(param.location,index);
            gl.activeTexture(gl.TEXTURE0+index);
            gl.bindTexture(gl.TEXTURE_2D,texture);
            gl.useProgram(null);
        };
    } else if (tn('MAT')) {
        param.mode = 'matrix';
        param.set  = undefined;
        console.log('Not supporting matrices yet');
    } else {
        param.mode = 'variable';
        var dtype  = tn('INT')?'i':'f';
        var vector = param.size>1?'v':'';
        var length = tn('VEC')?param.typename.slice(-1):'1';
        var name   = "uniform"+length+dtype+vector;
        param.setname = name;
        param.set = function(value){
            gl.useProgram(program);
            gl[param.setname](param.location,value);
            gl.useProgram(null);
        };
    }
    return param;
}

/**
 * Retrieves variable information by name from a WebGL context
 * WebGL doesn't provide an easy way to do this. So, the first time
 * this function is called on a program, it enumates all the unforms and
 * builds a model to query them by name
 * @param gl {WebGL context}
 * @param program {WebGL program} - shader program to search
 * @param name {string} - name of variable to query
 * @return parameter information object including index, name, abbreviated
 *      name (no brackets in case of arrays), typename, type (as WebGL
 *      ENUM), size (length, in the case of arrays, else 1), and a
 *      location object from getUniformLocation that can be used to assign
 *      to said parameter.
 */
function getParameter(gl,program,param) {
    if (!program.hasOwnProperty('__GL_VARINFO__')) {
        program.__GL_VARINFO__ = {};
        var nunif = gl.getProgramParameter(program,gl.ACTIVE_UNIFORMS);
        for (var iu=0; iu<nunif; iu++) {
            var unif = newParameter(gl,program,gl.getActiveUniform(program,iu));
            program.__GL_VARINFO__[unif.shortname] = unif;
        }
    }
    var found = program.__GL_VARINFO__[param];
    if (!found) {
        console.log('Could not locate parameter "'+param+'". '+
            'This may be benign (shader may have optimized it away),'+
            'or you may have a typo in the variable name.');
    }
    return found;
}

/**
 * Apply a shader program as if it were a function.
 *
 * Passing uniform variables:
 * The WebGL API does not provide multiple dispatch for us, so we
 * must determine which function to call based on the datatypes.
 * The type of the uniform as defined in the shader program will
 * determine which function we need to use. Normally it's assumed
 * that we know this can can specify the correct type. Automating
 * this is a little tricky.
 *
 * @param gl {WebGL context}
 * @param program {WebGL program} - shader program to apply
 * @param inputs - mapping from variable names to values. Supports both
 *                 uniforms and samplers.
 * @param output - a frame buffer or null if rendering to screen
 */
function applyProgram(program,inputs,output) {
    var texture_counter = 0;
    var gl = program.gl;
    for (var key in inputs) if (inputs.hasOwnProperty(key)) {
        var param = getParameter(gl, program, key);
        if (param.mode = 'texture') {
            var texture = inputs[key];
            if (texture.hasOwnProperty('texture')) {
                // basic raster framebuffer objects encapsulate their
                // redering texture. This lets us pass the frame buffer
                // rather than manually accessing the texture
                texture = texture.texture;
            }
            param.set(texture,texture_counter);
            texture_counter += 1;
        }
        else if (param.mode = 'texture') param.set(inputs[key]);
        else console.log("Matrices aren't supported yet");
    }
    renderProgram(gl,program,output);
}

/**
 * Get a WebGL context from a HTML5 canvas element, for raster rendering
 * We're specifically interested in the use case where the GL context
 * Is treated as a raster. So we set the viewport to exactly match
 * the canvas size, and prepare a default geometry that more or less
 * allows us to "bypass" the vertex shader and use only fragment shaders.
 * See also getRasterProgram.
 * @param  canvas {HTML5 canvas element} - on screen canvas for drawing
 * @return {WebGL context} - GL context that matches canvas resolution
 *                           and has a full-screen quad prepared to render to.
 */
function getRasterGL(canvas) {
    var gl = canvas.getContext("webgl")
          || canvas.getContext("experimental-webgl");
    if (!gl) {
        alert("Browser does now support WebGL");
        return gl;
    }
    // There are two dimensions we need to worry about
    // The canvas itself has a "fictional" dimension which is scaled to
    // the screen dimensions (you can do automatic up or downsampling by
    // setting this higher or lower than the actual on-screen size). The
    // webgl context also has its own ideas about the size of the viewport
    // that must be brought match.
    gl.viewport(0, 0,
        canvas.width =canvas.clientWidth,
        canvas.height=canvas.clientHeight);
    // Since WebGL is a 2D/3D API, we need to provide a "surface" onto which
    // to draw in order to directly access the canvas pixels. So we make a
    // quadrilateral that fills the whole screen. Combined with the vertex
    // shader set-up by getRasterProgram, this geometry affords us direct
    // access to screen pixels through the fragment shader.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),
        gl.STATIC_DRAW);
    gl.width  = canvas.width;
    gl.height = canvas.height;
    return gl;
}