/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 28.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.token_get_all = function( code ) {
    var VARIABLE = PHP.VM.Variable.prototype,
    COMPILER = PHP.Compiler.prototype;
    
    
    if ( !this[ COMPILER.SIGNATURE ]( arguments, "token_get_all", 1, [ [ VARIABLE.STRING, VARIABLE.NULL ] ] ) ) {
        return new PHP.VM.Variable( null );
    }
   
    switch( code[ VARIABLE.TYPE ] ) {
        
        case VARIABLE.BOOL:
            if ( code[ COMPILER.VARIABLE_VALUE ] === true ) {
                return PHP.VM.Array.fromObject.call( this, PHP.Lexer( "1" ));
            } else {
                return PHP.VM.Array.fromObject.call( this, PHP.Lexer( null ));
            }
            break;
        case VARIABLE.STRING:
        case VARIABLE.NULL:
            return PHP.VM.Array.fromObject.call( this, PHP.Lexer( code[ COMPILER.VARIABLE_VALUE ] ));
            break;
            
         default:
             return PHP.VM.Array.fromObject.call( this, PHP.Lexer( code[ VARIABLE.CAST_STRING ][ COMPILER.VARIABLE_VALUE ] ));
        
    }
    
    
    
};