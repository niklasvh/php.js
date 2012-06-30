/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 28.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.token_get_all = function( code ) {
    
    if ( !this[ PHP.Compiler.prototype.SIGNATURE ]( arguments, "token_get_all", 1, [ PHP.VM.Variable.prototype.STRING ] ) ) {
        return new PHP.VM.Variable( null );
    }
    
    
    
    return PHP.VM.Array.fromObject.call( this, PHP.Lexer( code.$ ));
};