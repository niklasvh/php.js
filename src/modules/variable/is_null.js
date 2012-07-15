/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.7.2012 
* @website http://hertzen.com
 */




PHP.Modules.prototype.is_null = function( variable ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    return new PHP.VM.Variable( variable[ VARIABLE.TYPE ] === VARIABLE.NULL );
    
 
    
};