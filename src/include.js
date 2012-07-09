
var files = {
        
    core: "js",
    halt: "js",
        
                
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
            array_key_exists: "js",
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
        functions: {
            call_user_func: "js"  
        },
        misc: {
            define: "js",
            defined: "js",
            eval: "js",
            php_egg_logo_guid: "js",
            php_logo_guid: "js",
            php_real_logo_guid: "js",
            zend_logo_guid: "js"
        },
        options: {
            ini_set: "js"
        },
        string: {
            echo: "js",
            implode: "js",
            parse_str: "js",
            print: "js",
            strlen: "js",
            strncmp: "js"
        },
        tokenizer: {
            constants: "js",
            token_get_all: "js",
            token_name: "js"
        },
        variable: {
            empty: "js",
            is_callable: "js",
            isset: "js",
            print_r: "js",
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
            Exception: "js",
            stdClass: "js"
        },
        interfaces: {
            ArrayAccess: "js"
        }
    }
};

if ( typeof document !== "undefined" ) {

    (function( d, files ){

        // files to include

    
    
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
    

    
    })( document, files );

}

exports.files = files;