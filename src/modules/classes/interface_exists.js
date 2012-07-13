/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 11.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.interface_exists = function( class_name, autoload ) {
    var COMPILER = PHP.Compiler.prototype;
     
    if ( (autoload === undefined || autoload[ COMPILER.VARIABLE_VALUE ] === true) && !this.$Class.Exists( class_name[ COMPILER.VARIABLE_VALUE ] ) ) {
        return new PHP.VM.Variable( this.$Class.__autoload( class_name[ COMPILER.VARIABLE_VALUE ] ) );
    }

    return new PHP.VM.Variable( this.$Class.Exists( class_name[ COMPILER.VARIABLE_VALUE ] )  );
    
};
