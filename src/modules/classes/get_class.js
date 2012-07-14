/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 9.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.get_class = function( object ) {
    var COMPILER = PHP.Compiler.prototype;
 
    if (object instanceof PHP.VM.Variable ) {
           return new PHP.VM.Variable( object[ COMPILER.VARIABLE_VALUE ][ COMPILER.CLASS_NAME ] );
    } else {
           return new PHP.VM.Variable( object[ COMPILER.CLASS_NAME ] );
    }
 
    
};