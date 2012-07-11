/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 12.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.key = function( array ) {
      var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
        ARRAY = PHP.VM.Array.prototype;
    

        
    if ( array [ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
        var pointer = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER],
        keys = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ];
        
        if ( pointer[ COMPILER.VARIABLE_VALUE ] >= keys.length ) {
            return new PHP.VM.Variable( false );
        } else {
            return new PHP.VM.Variable( keys[ pointer[ COMPILER.VARIABLE_VALUE ] ] );
        }
        
       
    } 
    
    
};