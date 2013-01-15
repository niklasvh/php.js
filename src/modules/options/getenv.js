PHP.Modules.prototype.getenv = function( name ) {
    var COMPILER = PHP.Compiler.prototype,
    variableValue = name[ COMPILER.VARIABLE_VALUE ];


    switch( variableValue ) {
        case "TEST_PHP_EXECUTABLE":
            return new PHP.VM.Variable( PHP.Constants.PHP_BINARY )
            break;
        default:
            return new PHP.VM.Variable( false );

    }
};
