/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 2.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.eval = function( $, code ) {
    

    
    var COMPILER = PHP.Compiler.prototype;
   
    var source = code[ COMPILER.VARIABLE_VALUE ];
        

    // tokenizer
    var tokens = new PHP.Lexer( "<?" + source );
   
    // build ast tree
    
    var AST = new PHP.Parser( tokens, true );
  
    if ( Array.isArray(AST) ) {
        
    
  
        // compile tree into JS
        var compiler = new PHP.Compiler( AST );
   
    

    
    
    
        // execture code in current context ($)
        var exec = new Function( "$$", "$", "ENV", compiler.src  );
        exec.call(this, function( arg ) {
            return new PHP.VM.Variable( arg );
        }, $, this);
    
    } else {
        
                this[ COMPILER.ERROR ]( "syntax error, unexpected $end in " + 
            this[ COMPILER.GLOBAL ]("$__FILE__")[ COMPILER.VARIABLE_VALUE ] + 
            "(1) : eval()'d code on line " + 1, PHP.Constants.E_PARSE );    
        
    }
    
};