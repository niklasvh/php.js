/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 11.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.class_exists = function( class_name ) {
    var COMPILER = PHP.Compiler.prototype;
    
    return new PHP.VM.Variable( this.$Class.Exists( class_name[ COMPILER.VARIABLE_VALUE ] )  );
    
};