/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 18.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.str_repeat = function( input, multiplier ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    variableValue = input[ COMPILER.VARIABLE_VALUE ];
    var str = "";
    
    for ( var i = 0, len = multiplier[ COMPILER.VARIABLE_VALUE ]; i < len; i++ ) {
        str += variableValue;
    }
    
    return new PHP.VM.Variable( str );
    
};