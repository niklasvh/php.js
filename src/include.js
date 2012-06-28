

(function( d ){

    // files to include
    var files = {
        core: "js",
        compiler: {
            compiler: "js",
            expr: "js",
            stmt: "js",
            scalar: "js"
        },
        modules: {
            init: "js",
            array: {
                array: "js",
                count: "js"
            },
            error: {
                constants: "js",
                error_reporting: "js",
                trigger_error: "js"
            },
            filesystem: {
                fopen: "js"
            },
            string: {
                echo: "js",
                implode: "js"
            },
            tokenizer: {
                constants: "js",
                token_get_all: "js",
                token_name: "js"
            },
            variable: {
                var_dump: "js"
            }
            
        },
        parser: {
            lexer: "js",
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