/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 29.6.2012 
* @website http://hertzen.com
 */


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
                        if ( type.indexOf( VARIABLE.STRING ) === -1 || ( typeof args[ paramIndex ][ VARIABLE.CAST_STRING ] !== "function" )  ) {
                          
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



PHP.Modules.prototype[ PHP.Compiler.prototype.ERROR ] = function( msg, level ) {
    var C = PHP.Constants;
    console.log( msg );
    switch ( level ) {
            
        case C.E_WARNING:
        case C.E_CORE_WARNING:
        case C.E_COMPILE_WARNING:
        case C.E_USER_WARNING:
            this.echo( new PHP.VM.Variable("\nWarning: " + msg + "\n"));
            return;
            break;
            
        case C.E_CORE_NOTICE:
            this.echo( new PHP.VM.Variable("\nNotice: " + msg + "\n"));
            return;
            break;
        default:
            this.echo( new PHP.VM.Variable("\nWarning: " + msg + "\n"));
            return;
            
            
    }
        
    
};