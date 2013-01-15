PHP.Modules.prototype.$include = function( $, $Static, file ) {

    var COMPILER = PHP.Compiler.prototype,
    filename = file[ COMPILER.VARIABLE_VALUE ];


    var path = this[ COMPILER.FILE_PATH ];


    var loaded_file = (/^(.:|\/)/.test( filename ) ) ? filename : path + "/" + filename;
    var $this = this;
    this.$Included.Include( loaded_file );
    try {
    var source = this[ COMPILER.FILESYSTEM ].readFileSync( loaded_file );
    }
    catch( e ) {

         $this.ENV[ COMPILER.ERROR ]("include(" + filename + "): failed to open stream: No such file or directory", PHP.Constants.E_CORE_WARNING, true );
         $this.ENV[ COMPILER.ERROR ]("include(): Failed opening '" +  filename + "' for inclusion (include_path='" + path + "')", PHP.Constants.E_CORE_WARNING, true );
    }

    var COMPILER = PHP.Compiler.prototype;

    // tokenizer
    var tokens = new PHP.Lexer( source );

    // build ast tree

    var AST = new PHP.Parser( tokens );

    // compile tree into JS
    var compiler = new PHP.Compiler( AST );

    // execture code in current context ($)
    var exec = new Function( "$$", "$", "ENV", "$Static", compiler.src  );

    this[ COMPILER.FILE_PATH ] = PHP.Utils.Path( loaded_file );
    
    exec.call(this, function( arg ) {
        return new PHP.VM.Variable( arg );
    }, $, this, $Static);
};


PHP.Modules.prototype.include = function() {
    this.$include.apply(this, arguments);
};