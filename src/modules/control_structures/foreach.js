/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 30.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.foreach = function( $, expr, func, value, key ) {
    
    console.log( expr );
    
    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype;
    
    if ( expr[ VAR.TYPE ] === VAR.ARRAY ) {
        var values = expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ],
        keys =  expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ],
        len = values.length,
        pointer = expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER];
        
        
        
        
        for ( pointer[ COMPILER.VARIABLE_VALUE ] = 0; pointer[ COMPILER.VARIABLE_VALUE ] < len; pointer[ COMPILER.VARIABLE_VALUE ]++ ) {
            value[ COMPILER.VARIABLE_VALUE ] = values[ pointer[ COMPILER.VARIABLE_VALUE ] ][ COMPILER.VARIABLE_VALUE ];
            if ( key instanceof PHP.VM.Variable ) {
                key[ COMPILER.VARIABLE_VALUE ] = keys[ pointer[ COMPILER.VARIABLE_VALUE ] ][ COMPILER.VARIABLE_VALUE ];
            }
            
            func();
            console.log( key );
            console.log( value[ COMPILER.VARIABLE_VALUE ] );
        }
        
        
    //    return new PHP.VM.Variable( values.length );
    }
    
    
    
};