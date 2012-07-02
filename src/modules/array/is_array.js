/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 2.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.is_array = function( variable ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype;
    

    return new PHP.VM.Variable( ( variable[ VAR.TYPE ] === VAR.ARRAY ) );
    
    
};