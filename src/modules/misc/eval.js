/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 2.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.eval = function( $, code ) {
    var COMPILER = PHP.Compiler.prototype;
   
    var AST = new Parser( this, tokens );
  
    //console.log( this.AST );
    //console.log( opts );
    var compiler = new PHP.Compiler( AST );
   
    console.log( code );
    
    var exec = new Function( "$$", "$", "ENV", compiler.src  );
    exec.call(this, function() {
        
    }, $, this);
    
};