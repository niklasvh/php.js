/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 12.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.next = function( array ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype;
    

        
    if ( array [ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
        var pointer = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER],
        values = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ];
        pointer[ COMPILER.VARIABLE_VALUE ]++; // advance pointer
        
        if ( pointer[ COMPILER.VARIABLE_VALUE ] >= values.length ) {
            return new PHP.VM.Variable( false );
        } else {

            return new PHP.VM.Variable( values [ pointer[ COMPILER.VARIABLE_VALUE ] ] );
        }
        
       
    } 
    
    
};
