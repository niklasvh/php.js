PHP.Modules.prototype.str_replace = function( search, replace, subject ) {
    var COMPILER = PHP.Compiler.prototype;

    var re = new RegExp( search[ COMPILER.VARIABLE_VALUE ], "g");
    return new PHP.VM.Variable( subject[ COMPILER.VARIABLE_VALUE ].replace( re, replace[ COMPILER.VARIABLE_VALUE ] ) );
};