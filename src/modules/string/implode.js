/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 27.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.implode = function( glue, pieces ) {
    var VARIABLE = PHP.VM.Variable.prototype,
    COMPILER = PHP.Compiler.prototype;
    
    if ( glue[ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
        // Defaults to an empty string
        pieces = glue;
        glue = "";
    } else {
        glue = glue[ COMPILER.VARIABLE_VALUE ];
    }
    
    var values = pieces[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ];
    
    
    
    return new PHP.VM.Variable( values.map(function( val ){
        return val[ COMPILER.VARIABLE_VALUE ];
    }).join( glue ) );
};