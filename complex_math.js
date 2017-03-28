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
*/
function debug_transform(node,path,parent) {
    console.log(node,path,parent);
    return node; // does nothing
}
