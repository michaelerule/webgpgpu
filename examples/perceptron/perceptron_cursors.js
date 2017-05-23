/*
New sprite renderer

Shader arguments: vec4; x,y,spritesheet_index,angle

*/
function sprite_renderer(gl,canvas,nsprites) {
        
    // Pack sprite location information in a vec4
    // x,y = sprite location in [0,1]^2 
    // z = sprite size
    // w = sprite rotation (radians)
    var spritedata = new Float32Array(4*nsprites);

    // Sprite atlas information
    // x,y = upper left corner in sprite atlas in [0,1]^2 coordinates
    // z,w = width, height of sprite within atals in [0,1]^2 coordinates
    var spritetext = new Float32Array(4*nsprites);

    // Offsets into spritedata vec4 for various datatypes
    var SPRITE_X     = 0;
    var SPRITE_Y     = 1;
    var SPRITE_SIZE  = 2;
    var SPRITE_ANGLE = 3;
    // Offsets into spritetext vec4 for various datatypes
    var SPRITE_W = 2;
    var SPRITE_H = 3;

    // MAKE A PROGRAM TO RENDER SPRITES
    // The vertex shader accepts the sprite locations and their offsets
    // into the texture coordinates, and forwards this information on to 
    // the fragment (pixel) shader
    var vertices = `
        // (attributes are per-vertex arguments)
        attribute vec4 a_sprite_data;               // x,y=position z=size w=rotation
        attribute vec4 a_sprite_texture_coordinate; // texture offsets, x,y,w,h
        // "varying" variables allow us to pass coordinates on down to the fragment
        // shader (below). These will be interpolated across triangles (if we are
        // drawing triangles). 
        varying vec4 v_sprite_data;               //  
        varying vec4 v_sprite_texture_coordinate; // x,y,w,h of texture atlas sprite
        varying vec2 v_transform;                 // rotation transformation
        #define SPRITE_RADIUS (32.0)
        void main() {
            // These two outputs tell OpenGL where and how big to draw the
            // sprite
            gl_Position  = vec4(a_sprite_data.xy, 0.0, 1.0);
            gl_PointSize = a_sprite_data.z;
            // These arguments will be forwarded to the fragment shader
            v_sprite_data = a_sprite_data;
            // forward the texture atlas rectangle argument to every fragment
            v_sprite_texture_coordinate = a_sprite_texture_coordinate;
            // Rotating information
            v_transform  = vec2(cos(a_sprite_data.w),sin(a_sprite_data.w));
    }`;
    // The fragment shader handles drawing each individiaul pixel for each
    // sprite
    var fragment = `
        precision highp float;
        // Texture offset inherited from the vertex shader
        varying vec2 v_offset;
        // Background offset for manual alpha blending
        varying vec2 p_offset;
        varying float p_size;
        uniform sampler2D sprites;
        uniform sampler2D background;
        #define SPRITE_ATLASS_WIDTH (128.0)
        #define SPRITE_WIDTH (32.0)
        #define SPRITE_ATLASS_WIDTH_SPRITES (4.0)
        #define EDGE_SHARPNESS (1.4)
        #define ALPHA_CUTOFF (0.2)
        #define W (512.0)
        #define EDGE_TAPER_START_PIXELS (1.0)
        #define EDGE_RADIUS (0.18)
        void main() {
            // This will be a point in [0,1]x[0,1] denoting the location on the sprite
            vec2 q = gl_PointCoord;
            // sprite sheet is 4x4 32x32 sprites
            vec2 v = v_offset;
            v.y = (SPRITE_ATLASS_WIDTH_SPRITES-1.0)-v.y;
            // v_offset should be a row-column index
            vec2 p=(q+v)*SPRITE_WIDTH/SPRITE_ATLASS_WIDTH;
            // get sprite pixel data
            vec4  frgnd = texture2D(sprites,p);
            float alpha = frgnd.w;
            float rr = length(q-0.5+1.0/p_size*vec2(.5,-.5));
            // Use a soft threshold to fade out the sprite at the edge
            // for smoother blending with the background (less visible pixelation)
            alpha *= 1.0/(1.0+exp(EDGE_SHARPNESS*p_size*(rr-(EDGE_RADIUS+EDGE_TAPER_START_PIXELS/p_size))));
            if (alpha<ALPHA_CUTOFF) discard;
            // Manual alpha blending with background
            vec2 p4    = (p_offset+1.0)*0.5+(p_size/W)*(vec2(q.x,1.0-q.y)-0.5);
            vec4 bkgnd = texture2D(background,p4);
            gl_FragColor = frgnd*alpha + (1.0-alpha)*bkgnd;
    }`


    // We have to manually walk through the compiliation and linking
    // steps for the vertex (polygons) and fragment (pixel) shader
    // programs each program must be created, initialized, compiled,
    // bound to our gl context, and the whole lot must then be linked
    // and put to use.
    var program  = gl.createProgram(); check_error(gl);
    compileAndBindShader(gl,program,vertices,gl.VERTEX_SHADER); check_error(gl);
    compileAndBindShader(gl,program,fragment,gl.FRAGMENT_SHADER); check_error(gl);
    gl.linkProgram(program);check_error(gl);
    gl.useProgram (program);check_error(gl);
    
    // Attach our newly created buffer of points to the GPU
    var pointbuffer = gl.createBuffer(); check_error(gl);
    // ... rest of this happens later, when we actually draw, since locations may change

    // Attach our newly created buffer of offsets to the GPU
    var offsetbuffer = gl.createBuffer();check_error(gl);
    // Binds buffer to a target... I do not know what a target is.
    gl.bindBuffer(gl.ARRAY_BUFFER, offsetbuffer);check_error(gl);
    // Copy data from the CPU to the GPU
    gl.bufferData(gl.ARRAY_BUFFER,offsets,gl.STATIC_DRAW);check_error(gl);
    // Now, pass sprite texture offsets
    offsetLocation = gl.getAttribLocation(program, "a_offset");check_error(gl);
    // Spec says "turns the generic vertex attribute array on at a given index position"
    // What the hell is "the generic vertex attribute array" ??
    // Jesus fucking christ the OpenGL API is poorly documented 
    gl.enableVertexAttribArray(offsetLocation);check_error(gl);
    // A hidden part of gl.vertexAttribPointer is that it binds the 
    // current ARRAY_BUFFER to the attribute.
    // The second argument is key to specifying float/vec2/vec3/vec4 (1234)
    gl.vertexAttribPointer(offsetLocation, 2, gl.FLOAT, false, 0, 0);check_error(gl);
    // Clean up: no longer talking about the offsets buffer
    // Done
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    function render_sprites(background,sprites,output,perceptron_model) {

        // TODO
        // Use perceptron_model to decide which cursors to draw (if any) 

        // basic raster framebuffer objects encapsulate their
        // redering texture. This lets us pass the frame
        // buffer rather than manually accessing the texture
        if (background.hasOwnProperty('texture'))
            background = background.texture;
        if (sprites.hasOwnProperty('texture'))
            sprites = sprites.texture;

        gl.useProgram (program);check_error(gl);

        // Set the background texture up as a parameter
        var texture_unit_index = 0;
        gl.uniform1i(gl.getUniformLocation(program,"background"),texture_unit_index);check_error(gl);
        gl.activeTexture(gl.TEXTURE0+texture_unit_index);check_error(gl);
        gl.bindTexture(gl.TEXTURE_2D,background);check_error(gl);
        
        // Set the sprite texture up as a parameter
        var texture_unit_index = 1;
        gl.uniform1i(gl.getUniformLocation(program,"sprites"),texture_unit_index);check_error(gl);
        gl.activeTexture(gl.TEXTURE0+texture_unit_index);check_error(gl);
        gl.bindTexture(gl.TEXTURE_2D,sprites);check_error(gl);
        
        // Set the sprite texture up as a parameter
        //bindTexture(gl,program,"sprites",1,sprites); check_error(gl);

        /*
        // Set the background texture up as a parameter
        bindTexture(gl,program,"background",0,background); check_error(gl);
        */
        
        // Copy data from the CPU to the GPU
        // For some reason this is simpler than when we passed the 
        // texture offsets -- I know not why. 
        //gl.bufferData(gl.ARRAY_BUFFER,points,gl.STATIC_DRAW);check_error(gl);
        //positionLocation = gl.getAttribLocation(program, "a_position");check_error(gl);

        //gl.bindBuffer(gl.ARRAY_BUFFER, pointbuffer);check_error(gl);
        //console.log(points);

        gl.bufferData(gl.ARRAY_BUFFER,points,gl.STATIC_DRAW);check_error(gl);
        positionLocation = gl.getAttribLocation(program, "a_position");check_error(gl);
        gl.enableVertexAttribArray(positionLocation);check_error(gl);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);check_error(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // Finally, render scene
        gl.bindFramebuffer(gl.FRAMEBUFFER,output);check_error(gl);
        gl.drawArrays(gl.POINTS, 0, nsprites); check_error(gl);
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);check_error(gl);
        gl.useProgram (null);check_error(gl);
        
        // move sprites to next point
        update_damped_sprites(ndots,npoint,points,alpha);
    };
    
        
    // Monitor the mouse location in texture coordinates
    var rect = canvas.getBoundingClientRect();
    p = {x:0,y:0};
    var active_cursor=null;
    function set_mouse_gl_coordinates(e) {
        p.x = 2.0*(e.pageX-rect.left)/gl.width -1.0;
        p.y = 2.0*(e.pageY-rect.top )/gl.height-1.0;
        p.x = Math.min(Math.max(p.x,-1.0),1.0);
        p.y = Math.min(Math.max(p.y,-1.0),1.0);
    }
    document.onmousemove = function(e) {
        //console.log(e);
        set_mouse_gl_coordinates(e);
        if (active_cursor!=null){
            // move one of the cursors
            points[active_cursor*2]  = p.x;
            points[active_cursor*2+1] = -p.y;
        };
        // relocate virtual mouse
        points[ndots*npoint*2]  = p.x;
        points[ndots*npoint*2+1] = -p.y;
    }
    function mouse_down(e) {
        //console.log(e);
        if (active_cursor!=null) {
            active_cursor=null;
            return;
        }
        set_mouse_gl_coordinates(e);
        // find closest point
        closest  = null;
        distance = 1e20; //basically infinite
        for (var i=0; i<npoint; i++) {
            // These are the actual mouse coordinates
            if (i==active_cursor) continue;
            var ix = (ndots-1)*2*npoint+i*2;
            var x=points[ix];
            var y=points[ix+1];
            var dx = p.x-x;
            var dy = -p.y-y;
            var r = dx*dx+dy*dy;
            //console.log(i+' '+r+' '+x+' '+y+' '+ix+' '+points.length);
            if (r<=distance) {
                distance=r;
                closest=i;
            }
        }
        if (distance<maxdistance)
            active_cursor=closest;
        else 
            active_cursor=null;
        //console.log('down '+closest);
    }
    function mouse_up(e) {
        //active_cursor=null;
    }
    
    // Bind to cursor control
    document.onmouseleave = 
    document.onmouseup = 
    document.onmouseout = mouse_up;
    document.onmouseenter = 
    document.onmousedown = mouse_down;
    document.onmouseclick = function(e) {
        active_cursor=null;
    };

    function get(i) {
        // return cursor data
        var ix = (ndots-1)*2*npoint+i*2;
        var x=points[ix];
        var y=points[ix+1];
        var result = [x,y];
        result.x = x;
        result.y = y;
        return result;
    }
    render_sprites.get = get;
    
    return render_sprites;

}


function cursor_renderer(gl,npoint,ndots,canvas) {
    
    // Total sprites used:
    // all cursors (npoint)
    // Times number of trailing "dots" (ndots)
    // Plus one point for a virtual mouse cursor
    var nsprites = npoint*ndots+1;

    var maxdistance=0.05;
        
    // Damping coefficient fur cursor trails
    var alpha  = 0.8;
    // We need two dimensions for every dot for every cursor, and one
    // spare point for the mouse sprite (if we use it)
    points = new Float32Array(2*(npoint*ndots+1));

    // There are 11 sprite in the texture at the moment
    // Plus one 12th "dot" sprite for the trails
    var NSPRITE=11;
    // Texture is packed into four columns of width 32
    var SPRITE_ATLAS_COLS=4;
    // Offsets are passed as vec2 (row/col index into sprite sheet)
    // So we need two dimension for every cursor or dot
    var offsets = new Float32Array(2*nsprites);
    // For every cursor, set it's location in the sprite sheet
    for (var i=0; i<npoint; i++) {
        var spritecol = ((i|0)%SPRITE_ATLAS_COLS)|0;
        var spriterow = (i/SPRITE_ATLAS_COLS)|0;
        offsets[2*i]=spritecol;
        offsets[2*i+1]=spriterow;
    }
    // Every other point is a "dot", not a main cursor
    // These are all set to the last sprite in the sprite sheet 
    var spritecol = ((NSPRITE|0)%SPRITE_ATLAS_COLS)|0;
    var spriterow = (NSPRITE/SPRITE_ATLAS_COLS)|0;
    for (var i=npoint; i<nsprites; i++) {
        offsets[2*i]=spritecol;
        offsets[2*i+1]=spriterow;
    }
    // For .. reasons .. we need to reverse this array
    // except the last sprite which needs to stay at the end
    var newoffsets = new Float32Array(2*nsprites);
    for (var i=0; i<nsprites; i++) {
        newoffsets[i*2] = offsets[(nsprites-2-i)*2];
        newoffsets[i*2+1] = offsets[(nsprites-2-i)*2+1];
    }
    var spritecol = ((NSPRITE+1|0)%SPRITE_ATLAS_COLS)|0;
    var spriterow = ((NSPRITE+1)/SPRITE_ATLAS_COLS)|0;
    newoffsets[(nsprites-1)*2] = spritecol;
    newoffsets[(nsprites-1)*2+1] = spriterow;
    offsets=newoffsets;
    //console.log(offsets);

    // MAKE A NEW PROGRAM TO RENDER SPRITES
    // The vertex shader accepts the sprite locations and their offsets
    // into the texture coordinates, and forwards this information on to 
    // the fragment (pixel) shader
    var vertices = `
        // (attributes are per-vertex arguments)
        attribute vec2 a_position; // the position of the sprite
        attribute vec2 a_offset;   // a texture coordinate offset
        // "varying" variables allow us to pass coordinates on down to the fragment
        // shader (below). These will be interpolated across triangles (if we are
        // drawing triangles). 
        varying vec2 v_offset;
        varying vec2 p_offset;
        varying float p_size;
        #define SPRITE_RADIUS (32.0)
        void main() {
            gl_Position  = vec4(a_position, 0.0, 1.0);
            gl_PointSize = SPRITE_RADIUS;
            v_offset     = a_offset;
            p_offset     = a_position;
            p_size       = gl_PointSize;
    }`;
    // The fragment shader handles drawing each individiaul pixel for each
    // sprite
    var fragment = `
        precision highp float;
        // Texture offset inherited from the vertex shader
        varying vec2 v_offset;
        // Background offset for manual alpha blending
        varying vec2 p_offset;
        varying float p_size;
        uniform sampler2D sprites;
        uniform sampler2D background;
        #define SPRITE_ATLASS_WIDTH (128.0)
        #define SPRITE_WIDTH (32.0)
        #define SPRITE_ATLASS_WIDTH_SPRITES (4.0)
        #define EDGE_SHARPNESS (1.4)
        #define ALPHA_CUTOFF (0.2)
        #define W (512.0)
        #define EDGE_TAPER_START_PIXELS (1.0)
        #define EDGE_RADIUS (0.18)
        void main() {
            // This will be a point in [0,1]x[0,1] denoting the location on the sprite
            vec2 q = gl_PointCoord;
            // sprite sheet is 4x4 32x32 sprites
            vec2 v = v_offset;
            v.y = (SPRITE_ATLASS_WIDTH_SPRITES-1.0)-v.y;
            // v_offset should be a row-column index
            vec2 p=(q+v)*SPRITE_WIDTH/SPRITE_ATLASS_WIDTH;
            // get sprite pixel data
            vec4  frgnd = texture2D(sprites,p);
            float alpha = frgnd.w;
            float rr = length(q-0.5+1.0/p_size*vec2(.5,-.5));
            // Use a soft threshold to fade out the sprite at the edge
            // for smoother blending with the background (less visible pixelation)
            alpha *= 1.0/(1.0+exp(EDGE_SHARPNESS*p_size*(rr-(EDGE_RADIUS+EDGE_TAPER_START_PIXELS/p_size))));
            if (alpha<ALPHA_CUTOFF) discard;
            // Manual alpha blending with background
            vec2 p4    = (p_offset+1.0)*0.5+(p_size/W)*(vec2(q.x,1.0-q.y)-0.5);
            vec4 bkgnd = texture2D(background,p4);
            gl_FragColor = frgnd*alpha + (1.0-alpha)*bkgnd;
    }`


    // We have to manually walk through the compiliation and linking
    // steps for the vertex (polygons) and fragment (pixel) shader
    // programs each program must be created, initialized, compiled,
    // bound to our gl context, and the whole lot must then be linked
    // and put to use.
    var program  = gl.createProgram(); check_error(gl);
    compileAndBindShader(gl,program,vertices,gl.VERTEX_SHADER); check_error(gl);
    compileAndBindShader(gl,program,fragment,gl.FRAGMENT_SHADER); check_error(gl);
    gl.linkProgram(program);check_error(gl);
    gl.useProgram (program);check_error(gl);
    
    // Attach our newly created buffer of points to the GPU
    var pointbuffer = gl.createBuffer(); check_error(gl);
    // ... rest of this happens later, when we actually draw, since locations may change

    // Attach our newly created buffer of offsets to the GPU
    var offsetbuffer = gl.createBuffer();check_error(gl);
    // Binds buffer to a target... I do not know what a target is.
    gl.bindBuffer(gl.ARRAY_BUFFER, offsetbuffer);check_error(gl);
    // Copy data from the CPU to the GPU
    gl.bufferData(gl.ARRAY_BUFFER,offsets,gl.STATIC_DRAW);check_error(gl);
    // Now, pass sprite texture offsets
    offsetLocation = gl.getAttribLocation(program, "a_offset");check_error(gl);
    // Spec says "turns the generic vertex attribute array on at a given index position"
    // What the hell is "the generic vertex attribute array" ??
    // Jesus fucking christ the OpenGL API is poorly documented 
    gl.enableVertexAttribArray(offsetLocation);check_error(gl);
    // A hidden part of gl.vertexAttribPointer is that it binds the 
    // current ARRAY_BUFFER to the attribute.
    // The second argument is key to specifying float/vec2/vec3/vec4 (1234)
    gl.vertexAttribPointer(offsetLocation, 2, gl.FLOAT, false, 0, 0);check_error(gl);
    // Clean up: no longer talking about the offsets buffer
    // Done
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    function render_sprites(background,sprites,output,perceptron_model) {

        // TODO
        // Use perceptron_model to decide which cursors to draw (if any) 

        // basic raster framebuffer objects encapsulate their
        // redering texture. This lets us pass the frame
        // buffer rather than manually accessing the texture
        if (background.hasOwnProperty('texture'))
            background = background.texture;
        if (sprites.hasOwnProperty('texture'))
            sprites = sprites.texture;

        gl.useProgram (program);check_error(gl);

        // Set the background texture up as a parameter
        var texture_unit_index = 0;
        gl.uniform1i(gl.getUniformLocation(program,"background"),texture_unit_index);check_error(gl);
        gl.activeTexture(gl.TEXTURE0+texture_unit_index);check_error(gl);
        gl.bindTexture(gl.TEXTURE_2D,background);check_error(gl);
        
        // Set the sprite texture up as a parameter
        var texture_unit_index = 1;
        gl.uniform1i(gl.getUniformLocation(program,"sprites"),texture_unit_index);check_error(gl);
        gl.activeTexture(gl.TEXTURE0+texture_unit_index);check_error(gl);
        gl.bindTexture(gl.TEXTURE_2D,sprites);check_error(gl);
        
        // Set the sprite texture up as a parameter
        //bindTexture(gl,program,"sprites",1,sprites); check_error(gl);

        /*
        // Set the background texture up as a parameter
        bindTexture(gl,program,"background",0,background); check_error(gl);
        */
        
        // Copy data from the CPU to the GPU
        // For some reason this is simpler than when we passed the 
        // texture offsets -- I know not why. 
        //gl.bufferData(gl.ARRAY_BUFFER,points,gl.STATIC_DRAW);check_error(gl);
        //positionLocation = gl.getAttribLocation(program, "a_position");check_error(gl);

        //gl.bindBuffer(gl.ARRAY_BUFFER, pointbuffer);check_error(gl);
        //console.log(points);

        gl.bufferData(gl.ARRAY_BUFFER,points,gl.STATIC_DRAW);check_error(gl);
        positionLocation = gl.getAttribLocation(program, "a_position");check_error(gl);
        gl.enableVertexAttribArray(positionLocation);check_error(gl);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);check_error(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // Finally, render scene
        gl.bindFramebuffer(gl.FRAMEBUFFER,output);check_error(gl);
        gl.drawArrays(gl.POINTS, 0, nsprites); check_error(gl);
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);check_error(gl);
        gl.useProgram (null);check_error(gl);
        
        // move sprites to next point
        update_damped_sprites(ndots,npoint,points,alpha);
    };
    
        
    // Monitor the mouse location in texture coordinates
    var rect = canvas.getBoundingClientRect();
    p = {x:0,y:0};
    var active_cursor=null;
    function set_mouse_gl_coordinates(e) {
        p.x = 2.0*(e.pageX-rect.left)/gl.width -1.0;
        p.y = 2.0*(e.pageY-rect.top )/gl.height-1.0;
        p.x = Math.min(Math.max(p.x,-1.0),1.0);
        p.y = Math.min(Math.max(p.y,-1.0),1.0);
    }
    document.onmousemove = function(e) {
        //console.log(e);
        set_mouse_gl_coordinates(e);
        if (active_cursor!=null){
            // move one of the cursors
            points[active_cursor*2]  = p.x;
            points[active_cursor*2+1] = -p.y;
        };
        // relocate virtual mouse
        points[ndots*npoint*2]  = p.x;
        points[ndots*npoint*2+1] = -p.y;
    }
    function mouse_down(e) {
        //console.log(e);
        if (active_cursor!=null) {
            active_cursor=null;
            return;
        }
        set_mouse_gl_coordinates(e);
        // find closest point
        closest  = null;
        distance = 1e20; //basically infinite
        for (var i=0; i<npoint; i++) {
            // These are the actual mouse coordinates
            if (i==active_cursor) continue;
            var ix = (ndots-1)*2*npoint+i*2;
            var x=points[ix];
            var y=points[ix+1];
            var dx = p.x-x;
            var dy = -p.y-y;
            var r = dx*dx+dy*dy;
            //console.log(i+' '+r+' '+x+' '+y+' '+ix+' '+points.length);
            if (r<=distance) {
                distance=r;
                closest=i;
            }
        }
        if (distance<maxdistance)
            active_cursor=closest;
        else 
            active_cursor=null;
        //console.log('down '+closest);
    }
    function mouse_up(e) {
        //active_cursor=null;
    }
    
    // Bind to cursor control
    document.onmouseleave = 
    document.onmouseup = 
    document.onmouseout = mouse_up;
    document.onmouseenter = 
    document.onmousedown = mouse_down;
    document.onmouseclick = function(e) {
        active_cursor=null;
    };

    function get(i) {
        // return cursor data
        var ix = (ndots-1)*2*npoint+i*2;
        var x=points[ix];
        var y=points[ix+1];
        var result = [x,y];
        result.x = x;
        result.y = y;
        return result;
    }
    render_sprites.get = get;
    
    return render_sprites;
};


function update_damped_sprites(ndots,npoint,points,alpha) {
    // TODO: reverse the stored order of the sprites
    // previously : new locations affect dots toward the end
    // and propagate backward.
    // now? new locations come in at the beginning and propagate 
    // forward
    var beta   = 1.0-alpha; 
    var noiselevel = 55.0;
    var screensize = 512.0;
    // move sprites
    for (var i=0; i<npoint*2; i++) {
        //points[(ndots-1)*npoint*2+i]+=(Math.random()*2-1)*noiselevel/screensize;
        for (var j=1; j<ndots; j++) 
            points[j*npoint*2+i]=beta*points[j*npoint*2+i]+alpha*points[(j-1)*npoint*2+i];
        // wrap around, but offscreen
        var x0=points[(ndots-1)*npoint*2+i];
        var x =(((x0*0.8+0.1+3.0)%2.0-1.0)-0.1)/0.8;
        var delta = x-x0;
        for (var j=0; j<ndots; j++) points[j*npoint*2+i] += delta;
    }
}


