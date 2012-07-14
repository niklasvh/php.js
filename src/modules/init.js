/*
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 29.6.2012
 * @website http://hertzen.com
 */

PHP.Modules.prototype[ PHP.Compiler.prototype.FUNCTION_HANDLER ] = function( ENV, functionName ) {
    var args = [ null ], // undefined context for bind
    COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    handler,
    staticVars = {}; // static variable storage


    // initializer
    args.push( function( args, values ) {
        handler = PHP.VM.VariableHandler( ENV );
        var vals = Array.prototype.slice.call( values, 2 );


        Object.keys( staticVars ).forEach( function( key ){
            handler( key, staticVars[ key ] );
        });

        args.forEach(function( argObject, index ){
            var arg = handler( argObject[ COMPILER.PARAM_NAME ] );

            // check that we aren't passing a constant for arg which is defined byRef
            if ( argObject[ COMPILER.PARAM_BYREF ] === true &&
                (
                    vals[ index ][ VARIABLE.CLASS_CONSTANT ] === true
                    || vals[ index ][ VARIABLE.CONSTANT ] === true
                    || vals[ index ][ COMPILER.NAV ] === true

                    )
                ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Only variables can be passed by reference", PHP.Constants.E_ERROR, true );
            }

            if ( argObject[ COMPILER.PARAM_BYREF ] === true ) {

                if (vals[ index ][ VARIABLE.DEFINED ] !== true ) {
                    // trigger setter
                    vals[ index ][ COMPILER.VARIABLE_VALUE ] = null;
                }

                arg[ VARIABLE.REF ]( vals[ index ] );
            } else {
                if ( vals[ index ] !== undefined ) {
                    arg[ COMPILER.VARIABLE_VALUE ] = vals[ index ][ COMPILER.VARIABLE_VALUE ];
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
            
        });
        var _SERVER = ENV[ COMPILER.GLOBAL ]('_SERVER')[ COMPILER.VARIABLE_VALUE ];
        // magic constants
        handler( "$__FILE__" )[ COMPILER.VARIABLE_VALUE ] = _SERVER[ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 'SCRIPT_FILENAME' )[ COMPILER.VARIABLE_VALUE ];

        handler( "$__METHOD__")[ COMPILER.VARIABLE_VALUE ] = functionName;
        handler( "$__FUNCTION__" )[ COMPILER.VARIABLE_VALUE ] = functionName;


        return handler;
    } );

    // static handler
    var staticHandler = {};
    staticHandler[ COMPILER.FUNCTION_STATIC_SET ] = function( name, def ) {

        if ( staticVars[ name ] !== undefined ) {
            // already defined
            return staticHandler;
        }
        // store it to storage for this func
        staticVars[ name ] = def;

        // assign it to current running context as well
        handler( name, def );

        return staticHandler;
    };

    args.push( staticHandler );


    return args;

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
                argGiven = ", NULL given";
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
                if ( !typeInterface && classObj[ COMPILER.CLASS_NAME ] !== propertyType ) {
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
    VARIABLE = PHP.VM.Variable.prototype,
    _SERVER = this[ COMPILER.GLOBAL ]('_SERVER')[ COMPILER.VARIABLE_VALUE ],
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
                                _SERVER[ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 'SCRIPT_FILENAME' )[ COMPILER.VARIABLE_VALUE ] +
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
                                _SERVER[ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 'SCRIPT_FILENAME' )[ COMPILER.VARIABLE_VALUE ] +
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
    suppress = false;

    MODULES.$ErrorReset = function() {
        lastError = undefined;
        errorHandler = undefined;
        suppress = false;
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
        VARIABLE = PHP.VM.Variable.prototype;

        methods[ COMPILER.CATCH ] = function( name, type, $, func ) {
            if ( variable[ VARIABLE.TYPE ] === VARIABLE.OBJECT  ) {

                if ( variable[ COMPILER.VARIABLE_VALUE ][ COMPILER.CLASS_NAME ] === type ) {
                    $( name, variable );

                    func();
                }
            }
            return methods;

        };

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

    MODULES.set_error_handler = function( error_handler, error_types )  {
        errorHandler = error_handler;
    };

    MODULES[ COMPILER.ERROR ] = function( msg, level, lineAppend ) {

        var C = PHP.Constants,
        _SERVER = this[ COMPILER.GLOBAL ]('_SERVER')[ COMPILER.VARIABLE_VALUE ];
        lastError = {
            message: msg,
            line: 1,
            type: level,
            file: _SERVER[ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 'SCRIPT_FILENAME' )[ COMPILER.VARIABLE_VALUE ]
        };

        if ( lineAppend === false ) {
            lineAppend = ", called in " + _SERVER[ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 'SCRIPT_FILENAME' )[ COMPILER.VARIABLE_VALUE ] + " on line 1 and defined in " + _SERVER[ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 'SCRIPT_FILENAME' )[ COMPILER.VARIABLE_VALUE ] + " on line 1";
        } else if ( lineAppend === true ) {
            lineAppend = " in " + _SERVER[ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 'SCRIPT_FILENAME' )[ COMPILER.VARIABLE_VALUE ] + " on line 1";
        } else {
            lineAppend = "";
        }




        if ( suppress === false ) {
            if ( errorHandler !== undefined ) {
                this.call_user_func(
                    errorHandler,
                    new PHP.VM.Variable( level ),
                    new PHP.VM.Variable( msg ),
                    new PHP.VM.Variable( _SERVER[ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 'SCRIPT_FILENAME' )[ COMPILER.VARIABLE_VALUE ] ),
                    new PHP.VM.Variable( 1 )
                    );
            } else {
                switch ( level ) {
                    case C.E_ERROR:
                        this[ COMPILER.DISPLAY_HANDLER ] = false;
                        this.$ob( "\nFatal error: " + msg + lineAppend + "\n");
                        throw new PHP.Halt( level );
                        return;
                        break;
                    case C.E_RECOVERABLE_ERROR:
                        this[ COMPILER.DISPLAY_HANDLER ] = false;
                        this.$ob( "\nCatchable fatal error: " + msg + lineAppend + "\n");
                        throw new PHP.Halt( level );
                        return;
                        break;

                    case C.E_WARNING:
                    case C.E_CORE_WARNING:
                    case C.E_COMPILE_WARNING:
                    case C.E_USER_WARNING:
                        this.echo( new PHP.VM.Variable("\nWarning: " + msg + lineAppend + "\n"));
                        return;
                        break;
                    case C.E_PARSE:
                        this.echo( new PHP.VM.Variable("\nParse error: " + msg + lineAppend + "\n"));
                        return;
                        break;
                    case C.E_CORE_NOTICE:
                        this.echo( new PHP.VM.Variable("\nNotice: " + msg + lineAppend + "\n"));
                        return;
                        break;
                    default:
                        this.echo( new PHP.VM.Variable("\nDefault Warning: " + msg + lineAppend + "\n"));
                        return;


                }
            }
        }


    };

})( PHP.Modules.prototype )





