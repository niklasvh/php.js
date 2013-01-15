/*
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 23.7.2012
* @website http://hertzen.com
 */



PHP.Modules.prototype.sprintf = function( format ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;

    if (format instanceof PHP.VM.VariableProto) {
        var value = format[ VARIABLE.CAST_STRING ][ COMPILER.VARIABLE_VALUE ];
        if ( format[ VARIABLE.TYPE ] !== VARIABLE.NULL ) {

            // todo fix to make more specific
            Array.prototype.slice.call( arguments, 1 ).forEach( function( item ) {
               value = value.replace(/%./, item[ VARIABLE.CAST_STRING ][ COMPILER.VARIABLE_VALUE ] );
            });

            return new PHP.VM.Variable( value );
        }
    }
};