/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.6.2012 
* @website http://hertzen.com
 */

/* token_name — Get the symbolic name of a given PHP token
 * string token_name ( int $token )
 */

PHP.Modules.prototype.token_name = function( token ) {
    
    if ( !this[ PHP.Compiler.prototype.SIGNATURE ]( arguments, "token_name", 1 ) ) {
        return new PHP.VM.Variable( null );
    }
    
    

};