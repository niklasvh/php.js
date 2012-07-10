/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.ob_get_clean = function() {
    return new PHP.VM.Variable( this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ].pop() );
    
};
