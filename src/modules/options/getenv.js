/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 18.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.getenv = function( name ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    variableValue = name[ COMPILER.VARIABLE_VALUE ];
 
 
    switch( variableValue ) {
        case "TEST_PHP_EXECUTABLE":
            console.log(PHP.Constants.PHP_BINARY);
            return new PHP.VM.Variable( PHP.Constants.PHP_BINARY )
            break;
        default:
            return new PHP.VM.Variable( false );
        
    }
};
    