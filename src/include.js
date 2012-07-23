
var files = {
    src: {
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
                array_merge: "js",
                array_pop: "js",
                array_push: "js",
                array_search: "js",
                array_shift: "js",
                array_unshift: "js",
                count: "js",
                current: "js",
                each: "js",
                is_array: "js",
                key: "js",
                list: "js",
                next: "js",
                reset: "js"
            
            },
            classes: {
                class_exists: "js",
                get_class: "js",
                get_declared_classes: "js",
                get_class_methods: "js",
                get_parent_class: "js",
                interface_exists: "js",
                is_subclass_of: "js",
                method_exists: "js"
            },
            control_structures: {
                foreach: "js",
                include: "js",
                include_once: "js",
                require: "js",
                require_once: "js"
            },
            date: {
                constants: "js",
                date_default_timezone_set: "js",
                mktime: "js",
                time: "js"
            },
            error: {
                constants: "js",
                trigger_error: "js"
            },
            filesystem: {
                constants: "js",
                dirname: "js",
                fclose: "js",
                file_get_contents: "js",
                fopen: "js",
                is_uploaded_file: "js",
                realpath: "js",
                rename: "js"
            },
            functions: {
                call_user_func: "js",
                create_function: "js",
                function_exists: "js"
            },
            math: {
                dechex: "js"  
            },
            misc: {
                constant: "js",
                define: "js",
                defined: "js",
                eval: "js",
                exit: "js",
                php_egg_logo_guid: "js",
                php_logo_guid: "js",
                php_real_logo_guid: "js",
                zend_logo_guid: "js"
            },
            network: {
                header: "js"  
            },
            options: {
                assert: "js",
                ini_get: "js",
                ini_set: "js",
                getenv: "js",
                set_time_limit: "js",
                zend_version: "js"
            },
            output: {
                constants: "js",
                flush: "js",
                ob: "js",
                ob_flush: "js",
                ob_get_contents: "js",
                ob_get_length: "js",
                ob_get_level: "js"
            
            },
            pcre: {
                preg_match: "js"  
            },
            string: {
                echo: "js",
                explode: "js",
                implode: "js",
                localeconv: "js",
                parse_str: "js",
                print: "js",
                printf: "js",
                setlocale: "js",
                str_repeat: "js",
                str_replace: "js",
                str_rot13: "js",
                strlen: "js",
                strncmp: "js",
                strtolower: "js",
                strtoupper: "js"
            },
            tokenizer: {
                constants: "js",
            //    internal: "js",
                token_get_all: "js",
                token_name: "js"
            },
            variable: {
                constants: "js",
                empty: "js",
                gettype: "js",
                is_callable: "js",
                is_float: "js",
                is_null: "js",
                is_string: "js",
                isset: "js",
                print_r: "js",
                serialize: "js",
                unserialize: "js",
                unset: "js",
                var_dump: "js",
                var_export: "js"
            }
            
        },
        parser: {
            lexer: "js",
            parser: "js",
            yyn: "js",
            yyn_stmt: "js",
            yyn_expr: "js",
            yyn_scalar: "js",
       //     data: "js",
            ini: "js",
         //   actions: "js",
            rawpost: "js"
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
                DateTime: "js",
                Exception: "js",
                ReflectionClass: "js",
                ReflectionException: "js",
                ReflectionMethod: "js",
                ReflectionProperty: "js",
                __PHP_Incomplete_Class: "js",
                stdClass: "js"
            },
            interfaces: {
                Traversable: "js",
                ArrayAccess: "js",
                Iterator: "js",
                IteratorAggregate: "js",
                Reflector: "js",
                Serializable: "js"
            
            }
        }
    },
    cfg: {
        locales: "js"
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
   
        writeFile( "../", files);
    

    
    })( document, files );

}

exports.files = files;