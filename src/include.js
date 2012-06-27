

(function( d ){

    // files to include
    var files = {
        core: "js",
        modules: {
            array: {
                array: "js"
            },
            error: {
              error_reporting: "js",
              trigger_error: "js"
            },
            string: {
                echo: "js",
                implode: "js"
            },
            tokenizer: {
                constants: "js",
                lexer: "js",
                token_name: "js"
            },
            variable: {
                var_dump: "js"
            }
            
        },
        compiler: {
          compiler: "js",
          expr: "js",
          stmt: "js",
          scalar: "js"
        },
        parser: {
            parser: "js"
        },
        vm: {
            vm: "js",
            "class": "js",
            variable: "js",
            array: "js"
        }
    };
    
    
    function writeFile( path, obj ) {
        Object.keys( obj ).forEach(function( file ) {
            if ( obj[ file ] === "js" ) {
                d.write('<script src="' + path + file + '.js"></script>');
            } else {
                writeFile( path + file + "/", obj[ file ] );
            }
        });
    }
    
    writeFile( "../src/", files);
    

    
})( document )