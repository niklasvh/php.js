/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.ob_get_level = function() {
    
    var FUNCTION_NAME = "ob_get_level",
    COMPILER = PHP.Compiler.prototype;
    
    if ( !this[ COMPILER.SIGNATURE ]( arguments, FUNCTION_NAME, 0, [ ] ) ) {
        return new PHP.VM.Variable( null );
    }
    
    return new PHP.VM.Variable( this[ COMPILER.OUTPUT_BUFFERS ].length - 1 );

};
