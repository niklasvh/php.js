/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 3.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.time = function() {
    
    return new PHP.VM.Variable( Math.round( Date.now() / 1000 ) );
};

