/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 29.6.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype[ PHP.Compiler.prototype.FUNCTION_HANDLER ] = function( ENV ) {
    var args = [ null ], // undefined context for bind
    COMPILER = PHP.Compiler.prototype,
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
            arg[ COMPILER.VARIABLE_VALUE ] = vals[ index ][ COMPILER.VARIABLE_VALUE ];
        });
        
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
    
    
    if ( args.length !== len ) {
       
        this[ COMPILER.ERROR ]( name + "() expects exactly " + len + " parameter, " + args.length + " given in " + 
            _SERVER[ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 'SCRIPT_FILENAME' )[ COMPILER.VARIABLE_VALUE ] + 
            " on line " + 0, PHP.Constants.E_CORE_WARNING );    
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
                    if ( type !== args[ paramIndex ][ VARIABLE.TYPE ] ) {
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
    suppress = false;
    
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
        
        methods[ COMPILER.CATCH ] = function( name, type, func ) {
            if ( variable[ VARIABLE.TYPE ] === VARIABLE.OBJECT  ) {
                
                if ( variable[ COMPILER.VARIABLE_VALUE ][ COMPILER.CLASS_NAME ] === type ) {
                    // TODO pass variable to func
                    func();
                }
            }
            
        };
       
        return methods;
    };
    
    MODULES[ COMPILER.ERROR ] = function( msg, level, lineAppend ) {
        var C = PHP.Constants,        
        _SERVER = this[ COMPILER.GLOBAL ]('_SERVER')[ COMPILER.VARIABLE_VALUE ];
        
        lineAppend = ( lineAppend === true ) ? " in " + _SERVER[ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 'SCRIPT_FILENAME' )[ COMPILER.VARIABLE_VALUE ] + " on line 1" : ""; 
       
        if ( suppress === false ) {
            
            switch ( level ) {
                case C.E_ERROR:
                    this.echo( new PHP.VM.Variable("\nFatal error: " + msg + lineAppend + "\n"));
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
        
    
    };
    
})( PHP.Modules.prototype )





