/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.dechex = function( variable ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    var num = variable[ COMPILER.VARIABLE_VALUE ];
    
    return new PHP.VM.Variable( parseInt( num, 10 ).toString( 16 ) );
};