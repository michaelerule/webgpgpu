/**
 * Routines for handling GUIs and passing parameters to GPU shaders
 *
 */

/**
 * Pase a list of types parameters
 * @param {string} text: multi-line string of typed WebGL parameter declarations 
 */
function parse_parameters(text) {
    var lines = text.split('\n');
    var parameters = {};
    for(var i=0; i<lines.length; i++) {
        var line  = lines[i];
        line = line.split('//')[0]; // remove comment if present
        // remove trailing and leading whitespace, and trailing
        // semicolon if present.
        line = line.replace(/^[ ]+|[ ;]+$/g,'');
        // collapse whitespace into single spacs
        line = line.replace(/\s\s+/g, ' ');
        var words = line.split(' ');
        if (words.length<2) continue;
        var type  = words[0];
        var name  = words[1];
        var value = null;
        if (line.indexOf('=')>=0)
            value = eval(line.split('=')[1]);
        // todo: do some validation and error handling
        parameters[name]={type:type,value:value};
        //console.log(name,Object.keys(parameters));
    }
    //console.log(parameters);
    return parameters;
}

/**
 * Parameters are passed to shaders as a mixture of uniforms and
 * #defined (or const) values defined at compile time.
 *
 * Wouldn't it be nice to have a unified way to handle this
 * automatically? In a way that allowed partial evaulation
 * of any parameters known at compile time, and automatially including
 * unknown parameters as uniforms?
 *
 * @param id -- string id of param list stored as HTML script element
 * @returns parameters -- mapping from name to type, value infor for
 *      each parameter.
 */
function get_parameters(id) {
    console.log(id);
    if (!$(id)) {
        console.log("Could not locate program "+fragment);
        return;
    }
    return parse_parameters($(id).text);
}

/**
 * Perform partial evaluation of a shader argument list. Parameters
 * that are provided are turned into (correctly typed) #define
 * statements. The remaining parameters are turned into uniform
 * variables and declared after the #defines. A list of parameters
 * not yet bound (i.e. list of uniform variables) is also generated
 * and returned.
 *
 * @param signature -- mapping from name to type info for
 *      each parameter.
 * @param parameter -- mapping from names to values of parameters to
 *      apply at compile time.
 * @returns residual parameter list that must be provided when
 *      calling the shader.
 */
function compile_bind(signature,parameters) {
    // todo check that parameters does not contain anything not in
    // signature and warn if so.
    var header = '';
    for (k in parameters) if (parameters.hasOwnProperty(k)) {
        console.log(k);
        var type  = signature[k].type;
        var value = parameters[k];
        if (value === undefined) {
            throw TypeError('Parameter '+k+' is undefined');
        }
        if (value === null) {
            throw TypeError('Parameter '+k+' is none');
        }
        var line  = '#define '+k+' ('+type+'('+String(value)+'))\n';
        header = header + line;
    }
    var uniforms = '';
    var resid = {};
    for (k in signature)
        if (signature.hasOwnProperty(k) && !(k in parameters)) {
            resid[k] = signature[k];
            var type = signature[k].type;
            var line = 'uniform '+type+' '+k+';';
            uniforms += line+'\n';
    }
    header = header + uniforms;
    return [header,resid];
}

/**
 * Generate an object to represent a shader program like a function
 * with a typed argument signature. This lets us treat shader
 * compilation like partial evaluation
 */
function getTypedProgram(parameters,shader) {

}


