/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */




PHP.Modules.prototype.list = function( array ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype;
        
    if ( array [ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
        var pointer = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER],
        values = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ];
       
        Array.prototype.slice.call( arguments, 1 ).forEach(function( variable, index ){
            if ( variable instanceof PHP.VM.Variable ) {
                variable[ COMPILER.VARIABLE_VALUE ] = values[ index ][ COMPILER.VARIABLE_VALUE ];
            }
        });
        
        
        return array;
        
        
       
    } 
    
    // fill with null
    Array.prototype.slice.call( arguments, 1 ).forEach(function( variable ){
        if ( variable instanceof PHP.VM.Variable ) {
            variable[ COMPILER.VARIABLE_VALUE ] = (new PHP.VM.Variable())[ COMPILER.VARIABLE_VALUE ];
        }
    });
    
    return new PHP.VM.Variable(false);
    
    
};