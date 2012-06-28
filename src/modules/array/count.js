/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 29.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.count = function( variable ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype;
    
    if ( variable[ VAR.TYPE ] === VAR.ARRAY ) {
        var values = variable[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ];
        
        return new PHP.VM.Variable( values.length );
    }
    
};