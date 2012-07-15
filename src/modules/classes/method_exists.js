/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 11.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.method_exists = function( object, method ) {
    var COMPILER = PHP.Compiler.prototype;
    
    if ( object instanceof PHP.VM.Variable ) {
        return new PHP.VM.Variable( (object[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.METHOD + method[ COMPILER.VARIABLE_VALUE ]] ) !== undefined );
    } else {
        return new PHP.VM.Variable( (object[ PHP.VM.Class.METHOD + method[ COMPILER.VARIABLE_VALUE ]] ) !== undefined ); 
    }
    
};