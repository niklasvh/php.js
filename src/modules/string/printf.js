/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.printf = function( format) {
    var COMPILER = PHP.Compiler.prototype,
    __toString = "__toString",
    VARIABLE = PHP.VM.Variable.prototype;
 
        
    if (format instanceof PHP.VM.VariableProto) {
        
        var value = format[ VARIABLE.CAST_STRING ][ COMPILER.VARIABLE_VALUE ];
        if ( format[ VARIABLE.TYPE ] !== VARIABLE.NULL ) {
                
            this.$ob( value );
                
        }
            
    } 
        

    
};