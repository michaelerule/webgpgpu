/*
Uses the math.js library to transform expressions into the collection 
of macros needed to evaluate complex arithmetic on the GPU
*/


/**

Accepts: parsed expression using math.parse
Returns: expression string for computing expresion as complex arithmetic using
the complex_macros shader macros

*/
function complex_macro(parsed_expression) {
    // does nothing
}


/*
transform(callback: function)

Recursively transform an expression tree via a transform function. Similar to Array.map, but recursively executed on all nodes in the expression tree. The callback function is a mapping function accepting a node, and returning a replacement for the node or the original node. Function callback is called as callback(node: Node, path: string, parent: Node) for every node in the tree, and must return a Node. Parameter path is a string containing a relative JSON Path.

For example, to replace all nodes of type SymbolNode having name ‘x’ with a ConstantNode with value 3:

Testing code

x = math.parse('(x*5+a)^(e+cos(-y))');
x.transform(debug_transform)

*/
function debug_transform(node,path,parent) {
    console.log('node:'+node+'; path:'+path+'; parent:'+parent);
    console.log('op:'+node.op);
    console.log('fn:'+node.fn);
    console.log('type:'+node.type);
    return node; // does nothing
}

/*
Testing code

x = math.parse('(z*5+pi)^(e+cos(-z)*1j)');
y = x.transform(complex_macro_transform)
y._toString();

*/
function vec2_constant_node(real,imag) {
    // package x as the real part of a vec2 complex number
    //console.log('creating constant for: '+x);
    // Eval vulnerability here, TODO fix
    var arg0 = new math.expression.node.ConstantNode(eval(real));
    var arg1 = new math.expression.node.ConstantNode(eval(imag));
    //throw new Error('how did you get here?');
    return new math.expression.node.FunctionNode("vec2",[arg0,arg1]);
}

function complex_macro_transform(node,path,parent) {
    //console.log('node:'+node+'; path:'+path+'; parent:'+parent);
    //console.log('op:'+node.op);
    //console.log('fn:'+node.fn);
    //console.log('type:'+node.type);

    // TODO: if implicit, set implicit to false?
    node.implicit = false;

    if (node.type==='AccessorNode') {
        throw new Error('Accessor nodes are not supported in complex expressions');
    }
    if (node.type==='ArrayNode') {
        throw new Error('Array nodes are not supported in complex expressions');
    }
    if (node.type==='AssignmentNode') {
        throw new Error('Assignment nodes are not supported in complex expressions');
    }
    if (node.type==='BlockNode') {
        throw new Error('Block nodes are not supported in complex expressions');
    }
    if (node.type==='ConditionalNode') {
        throw new Error('Conditional nodes are not supported in complex expressions');
    }
    if (node.type==='ConstantNode') {
        //console.log(node);
        //TODO: content here must be converted to a vec2
        // if there is a complex part, how do we handle that?
        // ( this will come up as an implicit complex multiplication )
        //console.log(node.value);
        if (parent && parent.type==='FunctionNode' && parent.name==='vec2') {
            // already processed this one, return it
            //console.log('already processed');
            //console.log(node);
            //console.log(parent);
            return node;
        }
        var x=node.value;
        //console.log(x);
        return vec2_constant_node(x,0);
    }
    if (node.type==='FunctionAssignmentNode') {
        throw new Error('Function assignment nodes are not supported in complex expressions');
    }
    if (node.type==='FunctionAssignmentNode') {
        throw new Error('Function assignment nodes are not supported in complex expressions');
    }
    if (node.type==='FunctionNode') {
        // In the complex macros header, if a complex version of a function 
        // exists, it is denoted by prefixing "c" to the ordinary function name
        return new math.expression.node.FunctionNode('c'+node.fn,node.args);
    }
    if (node.type==='IndexNode') {
        throw new Error('Index nodes are not supported in complex expressions');
    }
    if (node.type==='ObjectNode') {
        throw new Error('Object nodes are not supported in complex expressions');
    }
    if (node.type==='OperatorNode') {
        // Addition, subtraction, and unary minus work normally
        if (node.op==='-' || node.op==='+') return node;
        // multiplication, exponentiation, must be converted to their complex
        // function macros. 
        if (node.op==='*') {
            // TODO: this might be a complex literal? Check
            return new math.expression.node.FunctionNode('cmul',node.args);
        }
        if (node.op==='^') {
            return new math.expression.node.FunctionNode('cpow',node.args);
        }
        if (node.op==='/') {
            return new math.expression.node.FunctionNode('cdiv',node.args);
        }
        throw new Error('Unknown operator encountered '+node.op);
    }
    if (node.type==='ParenthesisNode') {
        return node; // nothing to do here
    }
    if (node.type==='RangeNode') {
        throw new Error('Range nodes are not supported in complex expressions');
    }
    if (node.type==='SymbolNode') {
        if (node.name=='z' ) return node; // only one variable supported
        if (node.name=='pi') return vec2_constant_node(3.14159265359,0);
        if (node.name=='e' ) return vec2_constant_node(2.71828182846,0);
        if (node.name=='i' ) return vec2_constant_node(0,1);
        if (node.name=='j' ) return vec2_constant_node(0,1);
        throw new Error('Only one variable defined (z), encountered '+node.name);
    }
    throw new Error('Unknown node type encountered: '+node.type);
}







