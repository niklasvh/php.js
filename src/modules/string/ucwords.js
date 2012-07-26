/* 
* @author Eric Lewis <elewis at boxy.co>
* @created 26.7.2012 
* @website www.boxy.co
 */



PHP.Modules.prototype.ucwords = function( str ) {
    var VARIABLE = PHP.VM.Variable.prototype,
    COMPILER = PHP.Compiler.prototype;
    
    str[ COMPILER.VARIABLE_VALUE ] += '';
        
    return ( str[ COMPILER.VARIABLE_VALUE ] ).replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return new PHP.VM.Variable( $1.toUpperCase(); );
    });
    
    
};