/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 16.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.create_function = function( args, source ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    
    // tokenizer
    var tokens = new PHP.Lexer( "<?php " + source[ COMPILER.VARIABLE_VALUE ] );
   
    // build ast tree
    
    var AST = new PHP.Parser( tokens );
  
    if ( Array.isArray(AST) ) {
        
    
  
        // compile tree into JS
        var compiler = new PHP.Compiler( AST );
   
    
    }
    
    var src = "function " + COMPILER.CREATE_VARIABLE + "( val ) { return new PHP.VM.Variable( val ); }\n" + COMPILER.VARIABLE + " = " + COMPILER.VARIABLE + "(";
    src += "[]"; // todo, add function variables
    src += ", arguments";

    src += ");\n" +compiler.src;
    
    
    // execture code in current context ($)
        
    var lambda = new PHP.VM.Variable( Function.prototype.bind.apply( 
        new Function( "$", COMPILER.FUNCTION_STATIC, COMPILER.FUNCTION_GLOBAL, src  ), 
        ( this.$FHandler )( this, "anonymous"  )) 
    );


    
    return lambda;
    
};
