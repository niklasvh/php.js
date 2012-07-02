

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
            arithmetic: "js",
            array: {
                array: "js",
                count: "js"
            },
            control_structures: {
                foreach: "js",
            },
            error: {
                constants: "js",
                error_reporting: "js",
                trigger_error: "js"
            },
            filesystem: {
                fclose: "js",
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
                isset: "js",
                unset: "js",
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
            array: "js",
            resource: "js",
            constants: "js"
        },
        predefined: {
            classes: {
                stdClass: "js"
            }
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