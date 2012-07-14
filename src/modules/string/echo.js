/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 24.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.echo = function() {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    Array.prototype.slice.call( arguments ).forEach(function( arg ){
        
        if (arg instanceof PHP.VM.VariableProto) {
            var triggerGet = arg[ COMPILER.VARIABLE_VALUE ];
            if ( arg[ VARIABLE.TYPE ] !== VARIABLE.NULL ) {
              //  this[ COMPILER.OUTPUT_BUFFERS ][this[ COMPILER.OUTPUT_BUFFERS ].length - 1] += arg[ COMPILER.VARIABLE_VALUE ];
                this.$ob( triggerGet );
            }
            
        } else {
            this.$ob( arg );
         //   this[ COMPILER.OUTPUT_BUFFERS ][this[ COMPILER.OUTPUT_BUFFERS ].length - 1] += arg;
        }
        
    }, this);
    
};