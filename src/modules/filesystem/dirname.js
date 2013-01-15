PHP.Modules.prototype.dirname = function( path ) {
    var COMPILER = PHP.Compiler.prototype,
    dir = PHP.Utils.Path( path[ COMPILER.VARIABLE_VALUE ] )
    return new PHP.VM.Variable( dir );
};