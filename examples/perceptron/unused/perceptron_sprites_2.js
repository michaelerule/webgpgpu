function render_sprites() {//gl,points,program,sprite_img,background_img) {
     
    // Binds buffer to a target... I do not know what a target is.
    //gl.bindBuffer(gl.ARRAY_BUFFER, pointbuffer);
    // Copy data from the CPU to the GPU
    gl.bufferData(gl.ARRAY_BUFFER,points,gl.STATIC_DRAW); check_error(gl);

    // First, pass sprite locations
    // We also need to manually pass arguments to the shader
    positionLocation = gl.getAttribLocation(program, "a_position"); check_error(gl);

    // Spec says "turns the generic vertex attribute array on at a given index position"
    // What the hell is "the generic vertex attribute array" ??
    // Jesus fucking christ the OpenGL API is poorly documented 
    gl.enableVertexAttribArray(positionLocation); check_error(gl);

    // The second argument is key to specifying float/vec2/vec3/vec4 (1234)
    // A hidden part of gl.vertexAttribPointer is that it binds the 
    // current ARRAY_BUFFER to the attribute.
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0); check_error(gl);

    // Done
    //gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Set the background texture up as a parameter
    bindTexture(gl,program,"background",1,background_img); check_error(gl);

    // Set the sprite texture up as a parameter
    bindTexture(gl,program,"sprites",1,sprite_img); check_error(gl);

    // Finally, render scene
    gl.useProgram (program); check_error(gl);
    gl.drawArrays(gl.POINTS, 0, points.length/2); check_error(gl);
    gl.useProgram (null); check_error(gl);
};
