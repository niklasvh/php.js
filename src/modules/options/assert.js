/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 14.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.assert = function( assertion ) {
    // todo add  
    var COMPILER = PHP.Compiler.prototype;
    return (new PHP.VM.Variable( assertion[ COMPILER.VARIABLE_VALUE] ));
    
};
