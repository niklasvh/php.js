/*
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 29.6.2012
 * @website http://hertzen.com
 */

PHP.Modules.prototype[ PHP.Compiler.prototype.FUNCTION_HANDLER ] = function( ENV, functionName, funcByRef ) {
    var args = [ null ], // undefined context for bind
    COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    handler,
    staticHandler = {},
    $GLOBAL = this[ COMPILER.GLOBAL ],
    __FILE__ = "$__FILE__",
    staticVars = {}; // static variable storage

    ENV.FUNCTION_REFS[ functionName ] = funcByRef;

    // initializer
    args.push( function( args, values ) {

        handler = PHP.VM.VariableHandler( ENV );
        var vals = Array.prototype.slice.call( values, 2 );



        args.forEach(function( argObject, index ){
            var arg = handler( argObject[ COMPILER.PARAM_NAME ] );

            PHP.Utils.ArgumentHandler( ENV, arg, argObject, vals[index], index, functionName );

            // redefine item in arguments object, to be used by func_get_arg(s)

            if ( argObject[ COMPILER.PARAM_BYREF ] === true ) {
                values[ index + 2 ] = arg;
            } else {
                values[ index + 2 ] = new PHP.VM.Variable( arg[ COMPILER.VARIABLE_VALUE ] );
            }
        });

        handler("GLOBALS", $GLOBAL( "GLOBALS") );

        // magic constants
        handler( "$__FILE__" )[ COMPILER.VARIABLE_VALUE ] = $GLOBAL(__FILE__)[ COMPILER.VARIABLE_VALUE ];

        handler( "$__METHOD__")[ COMPILER.VARIABLE_VALUE ] = functionName;
        handler( "$__FUNCTION__" )[ COMPILER.VARIABLE_VALUE ] = functionName;


        // static handler, the messed up ordering of things is needed due to js execution order
        PHP.Utils.StaticHandler( staticHandler, staticVars,  handler, ENV[ COMPILER.GLOBAL ] );




        return handler;
    } );

    args.push( staticHandler );


    return args;

};

PHP.Modules.prototype[ PHP.Compiler.prototype.FUNCTION ] = function( functionName, args ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    func_num_args = "func_num_args",
    message = "():  Called from the global scope - no function context",
    func_get_arg = "func_get_arg",
    func_get_args = "func_get_args",
    ret,
    item = PHP.VM.Array.arrayItem;

    if ( /^func_(get_args?|num_args)$/.test( functionName )) {
        if ( args[ 2 ] instanceof PHP.VM ) {
            this[ PHP.Compiler.prototype.ERROR ]( functionName + message, PHP.Constants.E_CORE_WARNING, true );
            if ( functionName === func_num_args ) {
                return new PHP.VM.Variable( -1 );
            } else {
                return new PHP.VM.Variable( false );
            }
        }

    }


    if ( functionName === func_num_args ) {


        return new PHP.VM.Variable( args.length - 2 );

    } else if ( functionName === func_get_arg ) {

        if ( !this[ COMPILER.SIGNATURE ]( Array.prototype.slice.call(arguments,2 ), func_get_arg, 1, [ VARIABLE.INT ] ) ) {
            return new PHP.VM.Variable( false );
        }

        if ( arguments[ 2 ][ COMPILER.VARIABLE_VALUE ] < 0 ) {
            this[ PHP.Compiler.prototype.ERROR ]( func_get_arg + "():  The argument number should be >= 0", PHP.Constants.E_WARNING, true );
            return new PHP.VM.Variable( false );
        }


        if ( args[ arguments[ 2 ][ COMPILER.VARIABLE_VALUE ] + 2 ] === undefined ) {
            this[ PHP.Compiler.prototype.ERROR ]( func_get_arg + "():  Argument " + arguments[ 2 ][ COMPILER.VARIABLE_VALUE ] + " not passed to function", PHP.Constants.E_CORE_WARNING, true );
            return new PHP.VM.Variable( false );
        } else {
            return args[ arguments[ 2 ][ COMPILER.VARIABLE_VALUE ] + 2 ];
        }

    } else if ( functionName === func_get_args ) {
        var props = [];

        Array.prototype.slice.call( args, 2 ).forEach(function( val, index ){

            props.push(item( index, val  ));
        });

        return this.array( props );
    } else if ( typeof functionName === "function" ) {
        // anonymous lambda function
        ret = functionName.apply( this, Array.prototype.slice.call( arguments, 2 ) );

    } else if ( this[ functionName ] === undefined ) {
        this[ PHP.Compiler.prototype.ERROR ]( "Call to undefined function " + functionName + "()", PHP.Constants.E_ERROR, true );
    } else {
        ret = this[ functionName ].apply( this, Array.prototype.slice.call( arguments, 2 ) );
    }

    PHP.Utils.CheckRef.call( this, ret, this.FUNCTION_REFS[ functionName ] );


    return ret;
};

PHP.Modules.prototype[ PHP.Compiler.prototype.TYPE_CHECK ] = function( variable, propertyType, propertyDefault, index, name ) {

    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    classObj,
    typeInterface = false;

    classObj = variable[ COMPILER.VARIABLE_VALUE ];
    if ( propertyDefault === undefined || (propertyDefault[ VARIABLE.TYPE ] !==  VARIABLE.NULL || variable[ VARIABLE.TYPE ] !== VARIABLE.NULL ) ) {

        var argPassedTo = "Argument " + (index + 1) + " passed to " + name + "() must ",
        argGiven,
        variableType = variable[ VARIABLE.TYPE ],
        errorMsg;

        switch ( variableType  ) {

            case VARIABLE.OBJECT:
                argGiven = ", instance of " + classObj[ COMPILER.CLASS_NAME ] + " given";
                break;

            case VARIABLE.INT:
                argGiven = ", integer given";
                break;

            case VARIABLE.NULL:
                argGiven = ", none given";
                break;

        }

        // check if we are looking for implement or instance
        // do a check if it exists before getting, so we don't trigger an __autoload
        if ( this.$Class.Exists( propertyType ) &&  this.$Class.Get( propertyType ).prototype[ COMPILER.CLASS_TYPE ] === PHP.VM.Class.INTERFACE) {
            typeInterface = true;
        }


        switch( propertyType.toLowerCase() ) {

            case "array":
                if ( VARIABLE.ARRAY !== variableType) {
                    errorMsg = argPassedTo + "be of the type array" + argGiven;
                }
                break;

            default:
                // we are looking for an instance
                if ( classObj === null) {
                    errorMsg = argPassedTo + "be an instance of " + propertyType + argGiven;
                }

                else if ( !typeInterface && classObj[ COMPILER.CLASS_NAME ] !== propertyType ) {
                    // not of same class type
                    errorMsg = argPassedTo + "be an instance of " + propertyType + argGiven;

                }

                // we are looking for an implementation of interface
                else if ( typeInterface && classObj[ PHP.VM.Class.INTERFACES ].indexOf( propertyType ) === -1) {
                    errorMsg = argPassedTo + "implement interface " + propertyType + argGiven;
                }

        }


        if ( errorMsg !== undefined ) {
            this[ COMPILER.ERROR ]( errorMsg , PHP.Constants.E_RECOVERABLE_ERROR, false );
        }

    }



};

PHP.Modules.prototype[ PHP.Compiler.prototype.SIGNATURE ] = function( args, name, len, types ) {
    var COMPILER = PHP.Compiler.prototype,
    $GLOBAL = this[ COMPILER.GLOBAL ],
    __FILE__ = "$__FILE__",
    VARIABLE = PHP.VM.Variable.prototype,
    typeStrings = {};

    typeStrings[ VARIABLE.NULL ] = "null";
    typeStrings[ VARIABLE.BOOL ] = "boolean";
    typeStrings[ VARIABLE.INT ] = "long";
    typeStrings[ VARIABLE.FLOAT ] = "float";
    typeStrings[ VARIABLE.STRING ] = "string";
    typeStrings[ VARIABLE.ARRAY ] = "array";
    typeStrings[ VARIABLE.OBJECT ] = "object";
    typeStrings[ VARIABLE.RESOURCE ] = "resource";

    if ( len < 0 && args.length > -len) {
        len = -len;
        this[ COMPILER.ERROR ]( name + "() expects at most " + len + " parameter" + (( len !== 1 ) ? "s" : "") + ", " + args.length + " given", PHP.Constants.E_WARNING, true );
        return false;
    } else if ( args.length !== len && len >= 0 ) {

        this[ COMPILER.ERROR ]( name + "() expects exactly " + len + " parameter" + (( len !== 1 ) ? "s" : "") + ", " + args.length + " given", PHP.Constants.E_WARNING, true );
        return false;
    } else {

        if ( Array.isArray( types ) ) {
            var fail = false;
            types.forEach(function( type, paramIndex ){

                if ( Array.isArray( type ) ) {

                    if ( type.indexOf( args[ paramIndex ][ VARIABLE.TYPE ] ) === -1 ) {
                        if ( type.indexOf( VARIABLE.STRING ) === -1 || ( args[ paramIndex ][ VARIABLE.CAST_STRING ][ VARIABLE.TYPE ] !== VARIABLE.STRING )  ) {

                            this[ COMPILER.ERROR ]( name + "() expects parameter " + ( paramIndex + 1 ) + " to be " + typeStrings[ type[ 0 ] ] + ", " + typeStrings[ args[ paramIndex ][ VARIABLE.TYPE ] ] + " given in " +
                                $GLOBAL(__FILE__)[ COMPILER.VARIABLE_VALUE ] +
                                " on line " + 0, PHP.Constants.E_CORE_WARNING );
                            fail = true;
                        }
                    }

                } else {

                    if ( args[ paramIndex ] !== undefined && type !== args[ paramIndex ][ VARIABLE.TYPE ] && type !== null ) {

                        if ( type === VARIABLE.INT && args[ paramIndex ][ VARIABLE.TYPE ] === VARIABLE.BOOL  ) {
                            return;
                        }


                        if ( type !== VARIABLE.STRING || ( typeof args[ paramIndex ][ VARIABLE.CAST_STRING ] !== "function" )  ) {
                            this[ COMPILER.ERROR ]( name + "() expects parameter " + ( paramIndex + 1 ) + " to be " + typeStrings[ type ] + ", " + typeStrings[ args[ paramIndex ][ VARIABLE.TYPE ] ] + " given in " +
                                $GLOBAL(__FILE__)[ COMPILER.VARIABLE_VALUE ] +
                                " on line " + 0, PHP.Constants.E_CORE_WARNING );
                            fail = true;
                        }
                    }
                }



            }, this);
            if ( fail === true ) {
                return false;
            }

        }

        return true;
    }
};

(function( MODULES ){

    var COMPILER = PHP.Compiler.prototype,
    lastError,
    errorHandler,
    reportingLevel = 32767,
    shutdownFunc,
    shutdownParams,
    suppress = false;

    MODULES.$ErrorReset = function() {
        lastError = undefined;
        errorHandler = undefined;
        shutdownFunc = undefined;
        shutdownParams = undefined;
        suppress = false;
        reportingLevel = 32767; // E_ALL
    };

    MODULES.register_shutdown_function = function( func ) {
        shutdownFunc = func;
        shutdownParams = Array.prototype.slice.call( arguments, 1 );
    };

    MODULES.$shutdown = function( ) {

        this.$Class.Shutdown();

        if ( shutdownFunc !== undefined ) {
            this.call_user_func.apply( this, [ shutdownFunc ].concat( arguments ) );
        }
    };


    MODULES[ COMPILER.SUPPRESS ] = function( expr ) {
        suppress = true;

        var result = expr();

        if ( result === undefined ) {
            result = new PHP.VM.Variable();
        }

        result[ COMPILER.SUPPRESS ] = true;

        suppress = false;
        return result;
    };

    MODULES[ COMPILER.EXCEPTION ] = function( variable ) {

        var methods =  {},
        VARIABLE = PHP.VM.Variable.prototype,
        caught = false;

        methods[ COMPILER.CATCH ] = function( name, type, $, func ) {
            if ( caught ) return methods;
            if ( variable[ VARIABLE.TYPE ] === VARIABLE.OBJECT  ) {

                var classObj = variable[ COMPILER.VARIABLE_VALUE ];

                if ( this.$Class.Inherits( classObj, type ) || classObj[ PHP.VM.Class.INTERFACES ].indexOf( type ) !== -1   ) {
                    $( name, variable );
                    caught = true;
                    func();
                }
            } else if ( variable instanceof PHP.Halt && /^Exception$/i.test( type )) {

                if ( variable.catchable !== true ) {

                    $( name, new (this.$Class.Get( "Exception"  ))( this, new PHP.VM.Variable( variable.msg )  ) );
                    caught = true;
                    func();
                } else {
                    throw variable;
                }
            }
            return methods;

        }.bind( this );

        return methods;
    };

    MODULES.error_get_last = function()  {
        var item = PHP.VM.Array.arrayItem;

        return this.array([
            item("type", lastError.type),
            item("message", lastError.message),
            item("file", lastError.file),
            item("line", lastError.line)
            ]);

    };

    MODULES.error_reporting = function( level ) {
        reportingLevel = level[ COMPILER.VARIABLE_VALUE ];
    };

    MODULES.set_error_handler = function( error_handler, error_types )  {
        errorHandler = error_handler;
    };

    MODULES[ COMPILER.ERROR ] = function( msg, level, lineAppend, strict, catchable ) {

        var C = PHP.Constants,
        $GLOBAL = this[ COMPILER.GLOBAL ],
        __FILE__ = "$__FILE__";
        lastError = {
            message: msg,
            line: 1,
            type: level,
            file: $GLOBAL(__FILE__)[ COMPILER.VARIABLE_VALUE ]
        };

        function checkType( type ) {

            return ((reportingLevel & C[ type ]) === C[ type ]);
        }

        if ( lineAppend === false ) {
            lineAppend = ", called in " + $GLOBAL( __FILE__ )[ COMPILER.VARIABLE_VALUE ] + " on line 1 and defined in " + $GLOBAL( __FILE__ )[ COMPILER.VARIABLE_VALUE ] + " on line 1";
        } else if ( lineAppend === true ) {
            if (this.EVALING === true ) {
                lineAppend = " in " + $GLOBAL(__FILE__)[ COMPILER.VARIABLE_VALUE ] + "(1) : eval()'d code on line 1";
            } else {
                lineAppend = " in " + $GLOBAL(__FILE__)[ COMPILER.VARIABLE_VALUE ] + " on line 1";
            }
        } else {
            lineAppend = "";
        }

        if ( this.$ini.track_errors == 1 ||  this.$ini.track_errors == "On") {
            $GLOBAL("php_errormsg")[ COMPILER.VARIABLE_VALUE ] = msg;
        }


        if (reportingLevel !== 0) {
            if ( suppress === false ) {
                if ( errorHandler !== undefined ) {


                    this.call_user_func(
                        errorHandler,
                        new PHP.VM.Variable( level ),
                        new PHP.VM.Variable( msg ),
                        new PHP.VM.Variable( $GLOBAL(__FILE__)[ COMPILER.VARIABLE_VALUE ] ),
                        new PHP.VM.Variable( 1 ),
                        this.array([])
                        );

                } else {
                    switch ( level ) {
                        case C.E_ERROR:
                            this[ COMPILER.DISPLAY_HANDLER ] = false;
                            throw new PHP.Halt( msg, level, lineAppend, catchable );
                            return;
                            break;
                        case C.E_RECOVERABLE_ERROR:
                            this[ COMPILER.DISPLAY_HANDLER ] = false;
                            //    this.$ob( "\nCatchable fatal error: " + msg + lineAppend + "\n");

                            throw new PHP.Halt( msg, level, lineAppend, catchable );
                            //   throw new PHP.Halt( level );
                            return;
                            break;

                        case C.E_WARNING:
                        case C.E_CORE_WARNING:
                        case C.E_COMPILE_WARNING:
                        case C.E_USER_WARNING:
                            if (this.$ini.display_errors != 0 && this.$ini.display_errors != "Off") {
                                this.echo( new PHP.VM.Variable("\nWarning: " + msg + lineAppend + "\n"));
                            }
                            return;
                            break;
                        case C.E_PARSE:
                            this.echo( new PHP.VM.Variable("\nParse error: " + msg + lineAppend + "\n"));
                            return;
                            break;
                        case C.E_CORE_NOTICE:
                        case C.E_NOTICE:
                            if (checkType("E_NOTICE")) {
                                this.echo( new PHP.VM.Variable("\nNotice: " + msg + lineAppend + "\n"));
                                return;
                            }
                            break;
                        case C.E_STRICT:
                            if (checkType("E_STRICT")) {
                                if ( strict ) {
                                    this.$strict += "Strict Standards: " + msg + lineAppend + "\n";
                                } else {
                                    this.echo( new PHP.VM.Variable("\nStrict Standards: " + msg + lineAppend + "\n"));
                                }
                            }
                            return;
                            break;
                        case C.E_DEPRECATED:
                            if (checkType("E_DEPRECATED")) {
                                this.echo( new PHP.VM.Variable("\nDeprecated: " + msg + lineAppend + "\n"));
                                return;
                            }

                            break;

                        default:
                            this.echo( new PHP.VM.Variable("\nDefault Warning: " + msg + lineAppend + "\n"));
                            return;


                    }
                }
            }
        }

    };

})( PHP.Modules.prototype )





