PHP.Modules.prototype.constant = function( name ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    variableValue = name[ COMPILER.VARIABLE_VALUE ];

    var constant = this[ COMPILER.CONSTANTS ][ COMPILER.CONSTANT_GET ]( variableValue );
    if ( constant[ VARIABLE.DEFINED ] !== true ) {
        this.ENV[ COMPILER.ERROR ]("constant(): Couldn't find constant " + variableValue, PHP.Constants.E_CORE_WARNING, true );
        return new PHP.VM.Variable();
    }
};