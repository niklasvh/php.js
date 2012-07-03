

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
                is_array: "js",
                count: "js"
            },
            control_structures: {
                foreach: "js",
                include: "js"
            },
            date: {
                mktime: "js",
                time: "js"
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
            misc: {
                eval: "js"  
            },
            string: {
                echo: "js",
                implode: "js",
                parse_str: "js",
                strlen: "js",
                strncmp: "js"
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
            parser: "js",
            data: "js",
            actions: "js"
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