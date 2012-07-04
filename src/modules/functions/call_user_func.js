/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 4.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.call_user_func = function( callback ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    if ( callback[ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {

        var Class = callback[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 0 )[ COMPILER.VARIABLE_VALUE ],
        methodName = callback[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 1 )[ COMPILER.VARIABLE_VALUE ];
        console.log( methodName );
        return Class[ COMPILER.METHOD_CALL ]( this, methodName, Array.prototype.slice.call( arguments, 1 ) );
        
    } else {
        return this[ callback[ COMPILER.VARIABLE_VALUE ]]( Array.prototype.slice.call( arguments, 1 ) );
    }
    
   
  
    
};
