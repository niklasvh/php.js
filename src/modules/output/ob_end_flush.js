/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.ob_end_flush = function() {
  var flush = this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ].pop();
  
  this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ][ this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ].length - 1 ] += flush;
};
