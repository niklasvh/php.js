/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 24.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.echo = function() {
    var COMPILER = PHP.Compiler.prototype,
    __toString = "__toString",
    VARIABLE = PHP.VM.Variable.prototype;
    Array.prototype.slice.call( arguments ).forEach(function( arg ){
        
        if (arg instanceof PHP.VM.VariableProto) {
            var value = arg[ VARIABLE.CAST_STRING ][ COMPILER.VARIABLE_VALUE ];
            
            if ( arg[ VARIABLE.TYPE ] === VARIABLE.FLOAT ) {
                this.$ob( value.toString().replace(/\./, this.$locale.decimal_point ) );
             } else if ( arg[ VARIABLE.TYPE ] === VARIABLE.BOOL && value != 1 ) { 
                 return;
            } else if ( arg[ VARIABLE.TYPE ] !== VARIABLE.NULL ) {
                
                this.$ob( value );
                
            }
            
        } else {
            this.$ob( arg );
        //   this[ COMPILER.OUTPUT_BUFFERS ][this[ COMPILER.OUTPUT_BUFFERS ].length - 1] += arg;
        }
        
    }, this);
    
};