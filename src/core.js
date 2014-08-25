var PHP = function( code, opts ) {
    var opts = opts || {};
    opts.filesystem = opts.filesystem || typeof(window) !== "undefined" ? new PHP.Adapters.XHRFileSystem() : require('fs');
    opts.SERVER = opts.SERVER || {};
    opts.SERVER.SCRIPT_FILENAME = opts.SERVER.SCRIPT_FILENAME || "";

    var iniContent = opts.filesystem.readFileSync( "cfg/php.ini" ),
    iniSet = opts.ini || {};
    opts.ini = PHP.ini( iniContent );

    Object.keys( iniSet ).forEach(function(key){
        this[ key ] = iniSet[ key ];
    }, opts.ini);

    this.tokens = PHP.Lexer( code, opts.ini );
    try {
        this.AST = new PHP.Parser( this.tokens );
    } catch( e ) {
        this.vm = {};
        this.vm.OUTPUT_BUFFER = "Parse error: " + e.message + " in " + opts.SERVER.SCRIPT_FILENAME + " on line " + e.line;
        return this;
    }


    var POST = opts.POST,
    RAW_POST = opts.RAW_POST,
    RAW = (RAW_POST !== undefined ) ? PHP.RAWPost( RAW_POST ) : {};

    opts.POST = ( POST !== undefined ) ? PHP.Utils.QueryString( POST ) : (RAW_POST !== undefined ) ? RAW.Post() : {};
    opts.RAW_POST = ( RAW_POST !== undefined ) ? RAW.Raw() : (POST !== undefined ) ? POST.trim() :  "";
    opts.GET = ( opts.GET !== undefined ) ? PHP.Utils.QueryString( opts.GET ) : {};

    opts.FILES = (RAW_POST !== undefined ) ? RAW.Files( opts.ini.upload_max_filesize, opts.ini.max_file_uploads, opts.ini.upload_tmp_dir ) : {};

    // needs to be called after RAW.Files
    if (RAW_POST !== undefined ) {
        RAW.WriteFiles( opts.filesystem.writeFileSync );
    }



    this.compiler = new PHP.Compiler( this.AST, opts.SERVER.SCRIPT_FILENAME );

    this.vm = new PHP.VM( this.compiler.src, opts );

    if (RAW_POST !== undefined ) {
        RAW.Error(this.vm[ PHP.Compiler.prototype.ERROR ].bind( this.vm ), opts.SERVER.SCRIPT_FILENAME);
    }

    this.vm.Run();
};

PHP.Constants = {};

PHP.Modules = function() {
    this.OUTPUT_BUFFER = "";
};

PHP.Adapters = {};

PHP.Utils = {};


PHP.Utils.$A = function( arr) {
    return Array.prototype.slice.call( arr );
};

PHP.Utils.ClassName = function( classVar ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    if ( classVar instanceof PHP.VM.Variable ) {
        if ( classVar[ VARIABLE.TYPE ] === VARIABLE.STRING ) {
            return classVar[ COMPILER.VARIABLE_VALUE ]
        } else {
            return classVar[ COMPILER.VARIABLE_VALUE ][ COMPILER.CLASS_NAME ];
        }
    }

};

PHP.Utils.Merge = function(obj1, obj2) {

    Object.keys( obj2 ).forEach(function( key ){
        obj1[ key ] = obj2 [ key ];
    });

    return obj1;
};

PHP.Utils.Path = function( path ) {

    path = path.substring(0, path.lastIndexOf("/"));

    return path;
};

PHP.Utils.Visible = function( name, objectValue, ctx ) {

    // helper function for checking whether variable/method is of type
    function checkType( name, type) {
        var value = objectValue[ PROPERTY_TYPE + name ];
        if (value === undefined) {
            return true;
        }

        if ( type === "PUBLIC") {
            return ((value & PHP.VM.Class[ type ]) === PHP.VM.Class[ type ]) || (value  === PHP.VM.Class.STATIC);
        } else {
            return ((value & PHP.VM.Class[ type ]) === PHP.VM.Class[ type ]);
        }

    }

    function hasProperty( proto, prop ) {
        while( proto !== undefined &&  proto[ PHP.VM.Class.PROPERTY + prop ] !== undefined ) {
            proto = Object.getPrototypeOf( proto );
        }

        return proto;

    }

    var COMPILER = PHP.Compiler.prototype,
    PROPERTY_TYPE = PHP.VM.Class.PROPERTY_TYPE,
    VARIABLE = PHP.VM.Variable.prototype;

    if ( (ctx instanceof PHP.VM.ClassPrototype) && objectValue[ COMPILER.CLASS_NAME ] === ctx[ COMPILER.CLASS_NAME ] ) {
        return true;
    } else {

        if ( (ctx instanceof PHP.VM.ClassPrototype) && this.$Class.Inherits( objectValue, ctx[ COMPILER.CLASS_NAME ] ) && checkType( name, "PROTECTED")) {

            return true;
        } else  if ( (ctx instanceof PHP.VM.ClassPrototype) && this.$Class.Inherits( objectValue, ctx[ COMPILER.CLASS_NAME ] ) && checkType( name, "PRIVATE")) {

            if (hasProperty( ctx, name ) ===  ctx) {
                return true;
            }


        } else if (checkType(name, "PUBLIC")) {

            return true;
        }
    }

    return false;

};

PHP.Utils.ArgumentHandler = function( ENV, arg, argObject, value, index, functionName ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;

    if ( argObject[ COMPILER.PARAM_BYREF ] === true ) {

        // check that we aren't passing a constant for arg which is defined byRef
        if ( ENV.FUNCTION_REFS[ functionName ] !==  true && ( value[ VARIABLE.CLASS_CONSTANT ] === true || value[ VARIABLE.CONSTANT ] === true || value[ COMPILER.NAV ] === true) ) {
            ENV[ PHP.Compiler.prototype.ERROR ]( "Only variables can be passed by reference", PHP.Constants.E_ERROR, true );
        }


        // check that we aren't passing a function return value
        if (   value[ VARIABLE.VARIABLE_TYPE ] === VARIABLE.FUNCTION ) {
            ENV[ PHP.Compiler.prototype.ERROR ]( "Only variables should be passed by reference", PHP.Constants.E_STRICT, true );
            value[ VARIABLE.VARIABLE_TYPE ] = undefined;
            value = new PHP.VM.Variable( value[ COMPILER.VARIABLE_VALUE ] );

        }

        if (value[ VARIABLE.DEFINED ] !== true ) {
            // trigger setter
            value[ COMPILER.VARIABLE_VALUE ] = null;
        }

        arg[ VARIABLE.REF ]( value );
    } else {

        if ( value !== undefined ) {

            if ( value instanceof PHP.VM.VariableProto) {

                if ( value[ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
                    // Array assignment always involves value copying. Use the reference operator to copy an array by reference.
                    arg[ COMPILER.VARIABLE_VALUE ] = value[ COMPILER.METHOD_CALL ]( {}, COMPILER.ARRAY_CLONE  );

                } else {
                    arg[ COMPILER.VARIABLE_VALUE ] = value[ COMPILER.VARIABLE_VALUE ];
                }
            } else {
                arg[ COMPILER.VARIABLE_VALUE ] = value;
            }


        } else {
            if ( argObject[ COMPILER.PROPERTY_DEFAULT ] !== undefined ) {
                arg[ COMPILER.VARIABLE_VALUE ] = argObject[ COMPILER.PROPERTY_DEFAULT ][ COMPILER.VARIABLE_VALUE ];
            } else {
                arg[ COMPILER.VARIABLE_VALUE ] = (new PHP.VM.Variable())[ COMPILER.VARIABLE_VALUE ];
            }
        }
    }



    if ( argObject[ COMPILER.PROPERTY_TYPE ] !== undefined ) {
        ENV[ COMPILER.TYPE_CHECK ]( arg, argObject[ COMPILER.PROPERTY_TYPE ], argObject[ COMPILER.PROPERTY_DEFAULT ], index, functionName );
    }
};

PHP.Utils.StaticHandler = function( staticHandler, staticVars, handler, $Global ) {

    var COMPILER = PHP.Compiler.prototype,
     VARIABLE = PHP.VM.Variable.prototype;

    staticHandler[ COMPILER.FUNCTION_STATIC_SET ] = function( name, def ) {

        if ( staticVars[ name ] === undefined ) {
            // store it to storage for this variable
            staticVars[ name ] = {
                def: def[ COMPILER.VARIABLE_VALUE ],
                val: def
            };

            // assign it to current running context as well
            handler( name, def );

        } else {
            if ( def [ COMPILER.VARIABLE_VALUE ] === staticVars[ name ].def ) {
                handler( name, staticVars[ name ].val );
            } else {
                staticVars[ name ] = {
                    def: def[ COMPILER.VARIABLE_VALUE ],
                    val: def
                };
                handler( name, def );
            }
        }


        return staticHandler;


    };


    // global handler
    staticHandler[ COMPILER.FUNCTION_GLOBAL ] = function( vars ) {
        vars.forEach(function( varName ){
            var val = $Global( varName );
            val[ VARIABLE.DEFINED ] = true;
            handler( varName, val )
        });
    };

    return staticHandler;

};

PHP.Utils.CheckRef = function( ret, byRef ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;

    if ( ret instanceof PHP.VM.Variable) {
        if ( byRef !== true) {

            ret[ VARIABLE.VARIABLE_TYPE ] = VARIABLE.FUNCTION;
        } else if (byRef === true){

            if (ret[ VARIABLE.REFERRING] === undefined && (ret[ VARIABLE.VARIABLE_TYPE ] === VARIABLE.NEW_VARIABLE || ret[ VARIABLE.VARIABLE_TYPE ] === VARIABLE.FUNCTION )) {

               this[ PHP.Compiler.prototype.ERROR ]( "Only variable references should be returned by reference", PHP.Constants.E_NOTICE, true );
            }
            ret[ VARIABLE.VARIABLE_TYPE ] = undefined;
        }
    }

};


PHP.Utils.TokenName = function( token ) {
    var constants = ["T_INCLUDE","T_INCLUDE_ONCE","T_EVAL","T_REQUIRE","T_REQUIRE_ONCE","T_LOGICAL_OR","T_LOGICAL_XOR","T_LOGICAL_AND","T_PRINT","T_PLUS_EQUAL","T_MINUS_EQUAL","T_MUL_EQUAL","T_DIV_EQUAL","T_CONCAT_EQUAL","T_MOD_EQUAL","T_AND_EQUAL","T_OR_EQUAL","T_XOR_EQUAL","T_SL_EQUAL","T_SR_EQUAL","T_BOOLEAN_OR","T_BOOLEAN_AND","T_IS_EQUAL","T_IS_NOT_EQUAL","T_IS_IDENTICAL","T_IS_NOT_IDENTICAL","T_IS_SMALLER_OR_EQUAL","T_IS_GREATER_OR_EQUAL","T_SL","T_SR","T_INSTANCEOF","T_INC","T_DEC","T_INT_CAST","T_DOUBLE_CAST","T_STRING_CAST","T_ARRAY_CAST","T_OBJECT_CAST","T_BOOL_CAST","T_UNSET_CAST","T_NEW","T_CLONE","T_EXIT","T_IF","T_ELSEIF","T_ELSE","T_ENDIF","T_LNUMBER","T_DNUMBER","T_STRING","T_STRING_VARNAME","T_VARIABLE","T_NUM_STRING","T_INLINE_HTML","T_CHARACTER","T_BAD_CHARACTER","T_ENCAPSED_AND_WHITESPACE","T_CONSTANT_ENCAPSED_STRING","T_ECHO","T_DO","T_WHILE","T_ENDWHILE","T_FOR","T_ENDFOR","T_FOREACH","T_ENDFOREACH","T_DECLARE","T_ENDDECLARE","T_AS","T_SWITCH","T_ENDSWITCH","T_CASE","T_DEFAULT","T_BREAK","T_CONTINUE","T_GOTO","T_FUNCTION","T_CONST","T_RETURN","T_TRY","T_CATCH","T_THROW","T_USE","T_INSTEADOF","T_GLOBAL","T_STATIC","T_ABSTRACT","T_FINAL","T_PRIVATE","T_PROTECTED","T_PUBLIC","T_VAR","T_UNSET","T_ISSET","T_EMPTY","T_HALT_COMPILER","T_CLASS","T_TRAIT","T_INTERFACE","T_EXTENDS","T_IMPLEMENTS","T_OBJECT_OPERATOR","T_DOUBLE_ARROW","T_LIST","T_ARRAY","T_CALLABLE","T_CLASS_C","T_TRAIT_C","T_METHOD_C","T_FUNC_C","T_LINE","T_FILE","T_COMMENT","T_DOC_COMMENT","T_OPEN_TAG","T_OPEN_TAG_WITH_ECHO","T_CLOSE_TAG","T_WHITESPACE","T_START_HEREDOC","T_END_HEREDOC","T_DOLLAR_OPEN_CURLY_BRACES","T_CURLY_OPEN","T_PAAMAYIM_NEKUDOTAYIM","T_DOUBLE_COLON","T_NAMESPACE","T_NS_C","T_DIR","T_NS_SEPARATOR"];
    var current = "UNKNOWN";
    constants.some(function( constant ) {
        if (PHP.Constants[ constant ] === token) {
            current = constant;
            return true;
        } else {
            return false;
        }
    });

    return current;
};

PHP.Utils.Filesize = function( size ) {

    if ( /^\d+M$/i.test( size )) {
        return (size.replace(/M/g,"") - 0) * 1024 * 1024;
    } else if ( /^\d+K$/i.test( size )) {
        return (size.replace(/K/g,"") - 0) * 1024;
    }

    return size;

};

PHP.Utils.QueryString = function( str ) {
    str = str.trim();
    var variables = str.split(/&/);

    var items = {};

    // going through each variable which have been split by &
    variables.forEach( function( variable ) {

        var parts = variable.split(/=/),
            key = decodeURIComponent( parts[ 0 ] ),
            value = (parts.length > 1 ) ? decodeURIComponent( parts[ 1 ] ) : null,

            arrayManager = function( item, parse, value ) {
                var arraySearch = parse.match(/^\[([a-z0-9+_\-\[]*)\]/i);
                if ( arraySearch !== null ) {
                    var key = ( arraySearch[ 1 ] === undefined ) ? Object.keys( item ).length : arraySearch[ 1 ];

                    if ( key.length === 0 ) {
                        key = Object.keys(item).length;

                    }
                    parse = parse.substring( arraySearch[ 0 ].length );

                    if ( parse.length > 0  ) {
                        if ( typeof item[ key ] !== "object" && item[ key ] !== null ) {
                            item[ key ] = {};
                        }

                        var ret = arrayManager( item[ key ], parse, value );

                        if ( ret !== undefined ) {
                            item[ key ] = ret;
                        }

                    } else {

                        item[ key ] = ( value !== null) ? value.replace(/\+/g," ") : null;
                    }


                } else {
                    if ( parse === "]") {
                        item = value;
                        return value;
                    }

                }


            };


            var arraySearch = key.match(/^(.*?)((\[[a-z+0-9_\-\[\]]*\])+)$/i);

            if ( arraySearch !== null ) {
                key =  arraySearch[ 1 ];



                if ( typeof items[ key ] !== "object" ) {
                    items[ key ] = {};

                }

                arrayManager( items[ key ], arraySearch[ 2 ], value );


            }
            else  {
                items[ key ] = ( value !== null) ? value.replace(/\+/g," ") : null;
            }

        }, this);

    return items;
};
