/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 1.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.unset = function() {
    
    PHP.Utils.$A( arguments ).forEach(function( arg ){
        if ( arg  !== undefined ) {
            arg[ PHP.Compiler.prototype.UNSET ]();
        }
    }, this );  
    
};