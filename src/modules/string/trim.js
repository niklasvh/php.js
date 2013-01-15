PHP.Modules.prototype.trim = function( variable ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;

    if ( variable[ VARIABLE.TYPE ] !== VARIABLE.STRING ) {
        variable = variable[ VARIABLE.CAST_STRING ];
    }

    return new PHP.VM.Variable( variable[ COMPILER.VARIABLE_VALUE ].toString().trim() );
};