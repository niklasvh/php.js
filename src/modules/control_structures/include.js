/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 3.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.include = function( $, file ) {
    
    var COMPILER = PHP.Compiler.prototype,
    _SERVER = this[ COMPILER.GLOBAL ]('_SERVER')[ COMPILER.VARIABLE_VALUE ],
    filename = file[ COMPILER.VARIABLE_VALUE ];
    
    
    
    var path = PHP.Utils.Path( _SERVER[ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 'SCRIPT_FILENAME' )[ COMPILER.VARIABLE_VALUE ]);
    
    var source = this[ COMPILER.FILESYSTEM ].readFileSync( path + "/" + filename );
    
        
    var COMPILER = PHP.Compiler.prototype;
   
    // tokenizer
    var tokens = new PHP.Lexer( source );
   
    // build ast tree
    
    var AST = new PHP.Parser( tokens );
  
    // compile tree into JS
    var compiler = new PHP.Compiler( AST );
   
    
    // execture code in current context ($)
    var exec = new Function( "$$", "$", "ENV", compiler.src  );
    exec.call(this, function( arg ) {
        return new PHP.VM.Variable( arg );
    }, $, this);

    console.log( source );
    
};
