
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
        array: {
            array: "js",
            array_key_exists: "js",
            count: "js",
            current: "js",
            each: "js",
            is_array: "js",
            list: "js",
            reset: "js"
            
        },
        classes: {
            get_class: "js"
        },
        control_structures: {
            foreach: "js",
            include: "js",
            include_once: "js",
            require: "js",
            require_once: "js"
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
        output: {
            constants: "js",
            flush: "js",
            ob: "js",
            ob_clean: "js",
            ob_flush: "js",
            ob_get_contents: "js",
            ob_get_level: "js"
            
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
            internal: "js",
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
            Traversable: "js",
            ArrayAccess: "js",
            Iterator: "js",
            IteratorAggregate: "js"
            
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