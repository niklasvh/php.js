/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 12.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.dirname = function( path ) {
    var COMPILER = PHP.Compiler.prototype,
    dir = PHP.Utils.Path( path[ COMPILER.VARIABLE_VALUE ] )
    console.log( dir, path );
    return new PHP.VM.Variable( dir );
};