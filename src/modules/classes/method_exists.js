/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 11.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.method_exists = function( object, method ) {
    var COMPILER = PHP.Compiler.prototype;
    
    
    return new PHP.VM.Variable( (object[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.METHOD + method[ COMPILER.VARIABLE_VALUE ]] ) !== undefined );
    
    
};