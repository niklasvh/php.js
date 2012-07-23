/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 22.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.str_replace = function( str ) {
    var VARIABLE = PHP.VM.Variable.prototype,
    COMPILER = PHP.Compiler.prototype;
    
    return new PHP.VM.Variable( str[ COMPILER.VARIABLE_VALUE ].toLowerCase() );
};