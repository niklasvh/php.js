/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 24.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.echo = function() {
    var COMPILER = PHP.Compiler.prototype;
    Array.prototype.slice.call( arguments ).forEach(function( arg ){
        
        if (arg instanceof PHP.VM.VariableProto) {
            if ( arg[ PHP.VM.Variable.prototype.TYPE ] !== PHP.VM.Variable.prototype.NULL ) {
                this[ COMPILER.OUTPUT_BUFFER ] += arg[ COMPILER.VARIABLE_VALUE ];
            }
            
        } else {
            this[ COMPILER.OUTPUT_BUFFER ] += arg;
        }
        
    }, this);
    
};