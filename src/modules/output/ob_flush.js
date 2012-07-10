/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.ob_flush = function() {
    
    var FUNCTION_NAME = "ob_flush",
    COMPILER = PHP.Compiler.prototype;
    
    if ( !this[ PHP.Compiler.prototype.SIGNATURE ]( arguments, FUNCTION_NAME, 0, [ ] ) ) {
        return new PHP.VM.Variable( null );
    }
     
    if ( this[ COMPILER.OUTPUT_BUFFERS ].length > 1 ) {
        var flush = this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ].pop();
        this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ][ this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ].length - 1 ] += flush;
        this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ].push("");
        this.$obflush();  
        return new PHP.VM.Variable( true );
    } else {
        this.ENV[ COMPILER.ERROR ]( FUNCTION_NAME + "(): failed to flush buffer. No buffer to flush", PHP.Constants.E_CORE_NOTICE, true );
        return new PHP.VM.Variable( false );
    }
    
};
