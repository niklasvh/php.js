/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 3.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.$include = function( $, file ) {
    
    var COMPILER = PHP.Compiler.prototype,
    _SERVER = this[ COMPILER.GLOBAL ]('_SERVER')[ COMPILER.VARIABLE_VALUE ],
    filename = file[ COMPILER.VARIABLE_VALUE ];
    
    
    var path = this[ COMPILER.FILE_PATH ];
    
    
    var loaded_file = (/^(.:|\/)/.test( filename ) ) ? filename : path + "/" + filename;
    
    
    var source = this[ COMPILER.FILESYSTEM ].readFileSync( loaded_file );
    
        
    var COMPILER = PHP.Compiler.prototype;
   
    // tokenizer
    var tokens = new PHP.Lexer( source );
   
    // build ast tree
    
    var AST = new PHP.Parser( tokens );
  
    // compile tree into JS
    var compiler = new PHP.Compiler( AST );
   
    console.log( compiler.src );
    // execture code in current context ($)
    var exec = new Function( "$$", "$", "ENV", compiler.src  );
    
    this[ COMPILER.FILE_PATH ] = PHP.Utils.Path( loaded_file );
    
    exec.call(this, function( arg ) {
        return new PHP.VM.Variable( arg );
    }, $, this);
    /*
     this needs to be fixed
    console.log("changing back");
    this[ COMPILER.FILE_PATH ] = path;
    */
};


PHP.Modules.prototype.include = function() {
    this.$include.apply(this, arguments);
};