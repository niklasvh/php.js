/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 6.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.$empty = function( arg) {

    var len = arguments.length, i = -1, arg,
    COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;


    // http://www.php.net/manual/en/types.comparisons.php
        
    if ( arg instanceof PHP.VM.Variable ) {
        var tmp = arg[ COMPILER.VARIABLE_VALUE ];
        return new PHP.VM.Variable( ((arg[ VARIABLE.TYPE ] === VARIABLE.NULL || tmp === "" || tmp == 0 || tmp === false)) );
    } else {
        return new PHP.VM.Variable( arg );
    }
        


};
