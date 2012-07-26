/* 
* @author Eric Lewis <elewis at boxy.co>
* @created 26.7.2012 
* @website www.boxy.co
 */



PHP.Modules.prototype.ucfirst = function( str ) {
    var VARIABLE = PHP.VM.Variable.prototype,
    COMPILER = PHP.Compiler.prototype;
    
    str[ COMPILER.VARIABLE_VALUE ] += '';
    
    var f = str[ COMPILER.VARIABLE_VALUE ].charAt(0).toUpperCase();
    
    return new PHP.VM.Variable( f + str.substr(1) );
};