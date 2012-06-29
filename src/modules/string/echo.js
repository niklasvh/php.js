/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 24.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.echo = function() {

    Array.prototype.slice.call( arguments ).forEach(function( arg ){
        
        if (arg instanceof PHP.VM.VariableProto) {
            if ( arg[ PHP.VM.Variable.prototype.TYPE ] !== PHP.VM.Variable.prototype.NULL ) {
                this.OUTPUT_BUFFER += arg[ PHP.Compiler.prototype.VARIABLE_VALUE ];
            }
            
        } else {
            this.OUTPUT_BUFFER += arg;
        }
        
    }, this);
    
};