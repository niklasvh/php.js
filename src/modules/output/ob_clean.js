/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.ob_clean = function() {
    var COMPILER = PHP.Compiler.prototype;
    
    if ( !this[ PHP.Compiler.prototype.SIGNATURE ]( arguments, "ob_clean", 0, [ ] ) ) {
        return new PHP.VM.Variable( null );
    }
    
    if ( this[ COMPILER.OUTPUT_BUFFERS ].length > 1 ) {
        this[ COMPILER.OUTPUT_BUFFERS ].pop();
        this[ COMPILER.OUTPUT_BUFFERS ].push("");
        return new PHP.VM.Variable( true );
    } else {
         this.ENV[ COMPILER.ERROR ]("ob_clean(): failed to delete buffer. No buffer to delete", PHP.Constants.E_CORE_NOTICE, true );
        return new PHP.VM.Variable( false );
    }
};
