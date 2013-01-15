/*
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 4.7.2012
* @website http://hertzen.com
 */


PHP.Modules.prototype.is_callable = function( callback ) {

    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;

    if ( callback[ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
        var Class = callback[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 0 )[ COMPILER.VARIABLE_VALUE ],
        methodName = callback[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 1 )[ COMPILER.VARIABLE_VALUE ];

        return new PHP.VM.Variable( typeof Class[ PHP.VM.Class.METHOD + methodName.toLowerCase()] === "function" );

    } 
};