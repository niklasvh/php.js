
PHP.VM = function( src, opts ) {

    var $ = PHP.VM.VariableHandler( this );

    var $$ = function( arg ) {

        var item = new PHP.VM.Variable( arg );
        item[ PHP.Compiler.prototype.NAV ] = true;

        return item;
    },
    COMPILER = PHP.Compiler.prototype,
    ENV = this;

    this.ENV = ENV;

    PHP.VM.Variable.prototype.ENV = ENV;

    ENV [ PHP.Compiler.prototype.FILESYSTEM ] = (opts.filesystem === undefined ) ? {} : opts.filesystem;

    // bind global variablehandler to ENV
    ENV[ PHP.Compiler.prototype.GLOBAL ] = $;

    ENV[ PHP.Compiler.prototype.CONSTANTS ] = PHP.VM.Constants( PHP.Constants, ENV );

    ENV.$ini = Object.create(opts.ini);

    ENV.$locale = {
        decimal_point: ".",
        thousands_sep: ","
    };

    ENV.$Included = (function(){

        var files = [];

        return {
            Include: function( file ) {
                files.push( file.toLowerCase() );
            },
            Included: function( file ) {
                return (files.indexOf( file.toLowerCase() ) !== -1)
            }
        }

    })();

    ENV.$Class = (function( declaredClasses ) {
        var classRegistry = {},
        COMPILER = PHP.Compiler.prototype,
        VARIABLE = PHP.VM.Variable.prototype,
        magicConstants = {},
        initiatedClasses = [],
        undefinedConstants = {},
        declaredClasses = [],
        autoloadedClasses = [],
        classHandler = new PHP.VM.Class( ENV, classRegistry, magicConstants, initiatedClasses, undefinedConstants, declaredClasses );

        ENV[ COMPILER.MAGIC_CONSTANTS ] = function( constantName ) {
            return new PHP.VM.Variable( magicConstants[ constantName ] );
        };

        var methods =  {
            Shutdown: function() {

                initiatedClasses.forEach( function( classObj ) {
                    classObj[  COMPILER.CLASS_DESTRUCT ]( ENV, true );
                });

            },
            __autoload: function( name ) {

                if ( typeof ENV.__autoload === "function" && autoloadedClasses.indexOf( name.toLowerCase() ) === -1) {
                    autoloadedClasses.push( name.toLowerCase() )
                    ENV.__autoload( new PHP.VM.Variable( name ) );
                }

                return methods.Exists( name );
            },
            Inherits: function(  obj, name ) {
                do {
                    if ( obj[ COMPILER.CLASS_NAME ] === name) {
                        return true;
                    }

                    obj = Object.getPrototypeOf( obj );
                }

                while( obj !== undefined && obj instanceof PHP.VM.ClassPrototype );
                return false;
            },
            INew: function( name, exts, func ) {
                return classHandler( name, PHP.VM.Class.INTERFACE, exts, func );
            },
            DeclaredClasses: function() {
                return declaredClasses;
            },
            New: function() {
                return classHandler.apply( null, arguments );
            },
            Exists: function( name ) {
                return (classRegistry[ name.toLowerCase() ] !== undefined);
            },
            ConstantGet: function( className, state, constantName ) {

                if ( !/^(self|parent)$/i.test( className ) && classRegistry[ className.toLowerCase() ] === undefined ) {
                    if ( undefinedConstants[ className + "::" + constantName] === undefined ) {
                        var variable = new PHP.VM.Variable();
                        variable[ VARIABLE.CLASS_CONSTANT ] = true;
                        variable[ VARIABLE.REGISTER_GETTER ] = function() {
                            if (classRegistry[ className.toLowerCase() ] === undefined ) {
                                ENV[ COMPILER.ERROR ]( "Class '" + className + "' not found", PHP.Constants.E_ERROR, true );
                            }
                        }
                        variable[ VARIABLE.DEFINED ] = className + "::$" + constantName;
                        undefinedConstants[ className + "::" + constantName] = variable;

                    }

                    return undefinedConstants[ className + "::" + constantName];

                } else if ( /^(self|parent)$/i.test( className )) {

                    if (/^(self)$/i.test( className)) {

                        return (( typeof state === "function") ? state.prototype : state)[ COMPILER.CLASS_CONSTANT_FETCH ]( state, constantName );

                    } else {
                        return Object.getPrototypeOf( ( typeof state === "function") ? state.prototype : state )[ COMPILER.CLASS_CONSTANT_FETCH ]( state, constantName );
                    }


                } else {

                    return methods.Get(  className, state )[ COMPILER.CLASS_CONSTANT_FETCH ]( state, constantName );
                }

            },
            Get: function( className, state, isInterface ) {

                if ( !/^(self|parent)$/i.test( className ) ) {

                    if (classRegistry[ className.toLowerCase() ] === undefined && methods.__autoload( className ) === false ) {

                        ENV[ COMPILER.ERROR ]( (( isInterface === true) ? "Interface" :  "Class") + " '" + className + "' not found", PHP.Constants.E_ERROR, true );
                    }

                    if (state !== undefined) {
                        return classRegistry[ className.toLowerCase() ].prototype;
                    } else {
                        return classRegistry[ className.toLowerCase() ];
                    }
                } else if ( /^self$/i.test( className ) ) {
                    return state.prototype;
                //      return Object.getPrototypeOf( state );
                } else if ( /parent/i.test( className ) ) {
                    return Object.getPrototypeOf( state.prototype  );
                //   return Object.getPrototypeOf( Object.getPrototypeOf( state ) );
                } else {

            }



            }
        };

        return methods;
    })();

    ENV[ PHP.Compiler.prototype.RESOURCES ] = PHP.VM.ResourceManager( ENV );

    ENV.$Array = new PHP.VM.Array( ENV );
    var variables_order = this.$ini.variables_order;

    this.FUNCTION_REFS = {};
    $('php_errormsg').$ = new PHP.VM.Variable();

    ENV[ PHP.Compiler.prototype.FILE_PATH ] = PHP.Utils.Path( opts.SERVER.SCRIPT_FILENAME );

    this.OUTPUT_BUFFERS = [""];
    this.$obreset();
    this.$ErrorReset();
    this.$strict = "";
    this.INPUT_BUFFER = opts.RAW_POST;

    // todo add error reporting level parser

    if (isNaN( this.$ini.error_reporting - 0)) {
        var lvl = this.$ini.error_reporting;
        ["E_ERROR",
        "E_RECOVERABLE_ERROR",
        "E_WARNING",
        "E_PARSE" ,
        "E_NOTICE" ,
        "E_STRICT",
        "E_DEPRECATED",
        "E_CORE_ERROR",
        "E_CORE_WARNING",
        "E_COMPILE_ERROR",
        "E_COMPILE_WARNING",
        "E_USER_ERROR",
        "E_USER_WARNING",
        "E_USER_NOTICE",
        "E_USER_DEPRECATED",
        "E_ALL"].forEach(function( err ){
            lvl = lvl.replace(err, PHP.Constants[ err ]);
        });
        this.$ini.error_reporting = eval(lvl);


    }
    this.error_reporting(new PHP.VM.Variable( this.$ini.error_reporting ));




    $('$__FILE__').$ = opts.SERVER.SCRIPT_FILENAME;
    $('$__DIR__').$ = ENV[ PHP.Compiler.prototype.FILE_PATH ];

    var post_max_size;

    if (  (post_max_size = PHP.Utils.Filesize(this.$ini.post_max_size)) > opts.RAW_POST.length || post_max_size == 0 ) {
        if (this.$ini.enable_post_data_reading != 0) {
            $('_POST').$ = PHP.VM.Array.fromObject.call( this, ( variables_order.indexOf("P") !== -1 ) ? opts.POST : {} ).$;
            $('HTTP_RAW_POST_DATA').$ = opts.RAW_POST;
        } else {
            $('_POST').$ = PHP.VM.Array.fromObject.call( this, {} ).$;
        }
    } else {
        $('_POST').$ = PHP.VM.Array.fromObject.call( this, {} ).$;
        if (this.$ini.always_populate_raw_post_data == 1 ) {
            ENV[ PHP.Compiler.prototype.ERROR ]( "Unknown: POST Content-Length of " + opts.RAW_POST.length + " bytes exceeds the limit of " + post_max_size + " bytes in Unknown on line 0", PHP.Constants.E_WARNING );
            ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot modify header information - headers already sent in Unknown on line 0", PHP.Constants.E_WARNING );
        } else {
            ENV[ PHP.Compiler.prototype.ERROR ]( "POST Content-Length of " + opts.RAW_POST.length + " bytes exceeds the limit of " + post_max_size + " bytes in Unknown on line 0", PHP.Constants.E_WARNING );
        }
    }

    $('_GET').$ = PHP.VM.Array.fromObject.call( this, ( variables_order.indexOf("G") !== -1 ) ? opts.GET : {} ).$;


    $('_SERVER').$ = PHP.VM.Array.fromObject.call( this, ( variables_order.indexOf("S") !== -1 ) ? opts.SERVER : {} ).$;
    $('_FILES').$ = PHP.VM.Array.fromObject.call( this, ( variables_order.indexOf("P") !== -1 && this.$ini.enable_post_data_reading != 0 && this.$ini.file_uploads == 1 ) ? opts.FILES : {} ).$;

    $('_ENV').$ = PHP.VM.Array.fromObject.call( this, ( variables_order.indexOf("E") !== -1 ) ? {} : {} ).$;


    var staticHandler = {}, staticVars = {};

    PHP.Utils.StaticHandler( staticHandler, staticVars, $, $ );

    this.$Static = staticHandler;

    Object.keys( PHP.VM.Class.Predefined ).forEach(function( className ){
        PHP.VM.Class.Predefined[ className ]( ENV, $$ );
    });

    //$('GLOBALS').$ = new (ENV.$Class.Get("__Globals"))( this );

    var obj = {};

    obj[ COMPILER.DIM_FETCH ] = function( ctx, variable ) {
        return $( variable[ COMPILER.VARIABLE_VALUE ] );
    };



    $('GLOBALS', obj);

    var shutdown = false;
    ENV[ COMPILER.TIMER ] = function(){
        if ( Date.now() > this.start + (this.$ini.max_execution_time - 0)*1000) {

            if (this.$ini.display_errors != 0) {
                this.$ob( "\nFatal error: Maximum execution time of " + this.$ini.max_execution_time + " second exceeded in " + $('$__FILE__').$ + " on line 1\n");

            }
            if (shutdown === false ){
                shutdown = true;
                this.$obflush.call( ENV );
                this.$shutdown.call( ENV );
            }

            // we aint killing it always with a single throw?? todo examine why
            throw Error;
            throw Error;
            throw Error;
            throw Error;
        }
    }.bind(this);

    this.Run = function() {
        this.start = Date.now();

        if ( false ) {


            var exec = new Function( "$$", "$", "ENV", "$Static", src  );
            exec.call(this, $$, $, ENV, staticHandler);


        } else {
            try {


                var exec = new Function( "$$", "$", "ENV", "$Static", src  );
                exec.call(this, $$, $, ENV, staticHandler);
                if (shutdown === false ){
                    shutdown = true;
                    this.$obflush.call( ENV );
                    this.$shutdown.call( ENV );
                }

            } catch( e ) {
                var C = PHP.Constants;
                if ( e instanceof PHP.Halt) {
                    switch (e.level) {
                        case C.E_ERROR:
                            this.$ob( "\nFatal error: " + e.msg + e.lineAppend + "\n");
                            break;
                        case C.E_RECOVERABLE_ERROR:
                            this.$ob( "\nCatchable fatal error: " + e.msg + e.lineAppend + "\n");
                            break;
                    }
                }
            }
        }

        this.OUTPUT_BUFFER = this.$strict + this.OUTPUT_BUFFERS.join("");
    }.bind( this );


};

PHP.VM.prototype = new PHP.Modules();

