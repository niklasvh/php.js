PHP.Modules.prototype.eval = function( $, $Static, $this, ctx, ENV, code) {
    var COMPILER = PHP.Compiler.prototype;

    var source = code[ COMPILER.VARIABLE_VALUE ];


    // tokenizer
    var tokens = new PHP.Lexer( "<?php " + source );

    // build ast tree

    var AST = new PHP.Parser( tokens, true );

    if ( Array.isArray(AST) ) {
        // compile tree into JS
        var compiler = new PHP.Compiler( AST, undefined, {
            INSIDE_METHOD: ( ctx !== undefined) ? true : false
        } );


        // execture code in current context ($)
        var exec = new Function( "$$", "$", "ENV", "$Static", "ctx",  compiler.src  );
        this.EVALING = true;
        var ret = exec.call($this, function( arg ) {
            return new PHP.VM.Variable( arg );
        }, $, ENV, $Static, ctx);

        this.EVALING = undefined;
        return ret;
    } else {

                this[ COMPILER.ERROR ]( "syntax error, unexpected $end in " +
            this[ COMPILER.GLOBAL ]("$__FILE__")[ COMPILER.VARIABLE_VALUE ] +
            "(1) : eval()'d code on line " + 1, PHP.Constants.E_PARSE );

    }

};