PHP.Modules.prototype.strncmp = function( str1, str2, len ) {

    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype;

    if ( ( str1[ VAR.CAST_STRING ][ COMPILER.VARIABLE_VALUE ].substring(0, len[ COMPILER.VARIABLE_VALUE ] ) === str2[ VAR.CAST_STRING ][ COMPILER.VARIABLE_VALUE ].substring(0, len[ COMPILER.VARIABLE_VALUE ] ) ) ) {
         return new PHP.VM.Variable( 0 );
    } else {
         return new PHP.VM.Variable( 1 );
    }
};