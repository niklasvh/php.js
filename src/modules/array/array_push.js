/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 14.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.array_push = function( array ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    array[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, "append", arguments[ 1 ] )
};

