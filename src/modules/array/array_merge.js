/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 19.7.2012 
* @website http://hertzen.com
 */




PHP.Modules.prototype.$array_merge = function() {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype,
    CLASS_PROPERTY = PHP.VM.Class.PROPERTY;
    
    var array = this.array([]);

    var value = array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ].pop(),
    key =  array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ].pop();

        
    return array;

};
