/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.ob_get_length = function() {
    var FUNCTION_NAME = "ob_get_length",
    COMPILER = PHP.Compiler.prototype;
    
    if ( !this[ PHP.Compiler.prototype.SIGNATURE ]( arguments, FUNCTION_NAME, 0, [ ] ) ) {
        return new PHP.VM.Variable( null );
    }
    
    if ( this[ COMPILER.OUTPUT_BUFFERS ].length > 1 ) {
        return new PHP.VM.Variable( this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ][this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ].length - 1].length );
    } else {
        //   this.ENV[ COMPILER.ERROR ]( FUNCTION_NAME + "(): failed to flush buffer. No buffer to flush", PHP.Constants.E_CORE_NOTICE, true );
        return new PHP.VM.Variable( false );
    }

};