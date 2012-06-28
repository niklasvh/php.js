/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 29.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype[ PHP.Compiler.prototype.SIGNATURE ] = function( args, name, len ) {
    var COMPILER = PHP.Compiler.prototype;
    
    if ( args.length !== len ) {
       
        this[ PHP.Compiler.prototype.ERROR ]( name + "() expects exactly " + len + " parameter, " + args.length + " given in " + 
            this[ COMPILER.GLOBAL ]('_SERVER')[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 'SCRIPT_FILENAME' )[ COMPILER.VARIABLE_VALUE ] + 
            " on line " + 0, PHP.Constants.E_CORE_WARNING );    
        return false;
    } else {
        return true;
    }
};


PHP.Modules.prototype[ PHP.Compiler.prototype.ERROR ] = function( msg, level ) {
    var C = PHP.Constants;
    switch ( level ) {
            
        case C.E_WARNING:
        case C.E_CORE_WARNING:
        case C.E_COMPILE_WARNING:
        case C.E_USER_WARNING:
            this.echo( new PHP.VM.Variable("\nWarning: " + msg + "\n"));
            return;
            break;
            
    }
        
    
};