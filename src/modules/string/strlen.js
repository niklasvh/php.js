/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 3.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.strlen = function( string ) {
    
    var COMPILER = PHP.Compiler.prototype;
    
    return new PHP.VM.Variable( string[ COMPILER.VARIABLE_VALUE ].length );
    
};