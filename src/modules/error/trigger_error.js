/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 26.6.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.trigger_error = function( msg, level ) {
    throw new Error( "Fatal error: " + msg.$ );
    
};