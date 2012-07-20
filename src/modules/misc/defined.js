/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 7.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.defined = function( name ) {
    
    var COMPILER = PHP.Compiler.prototype,
    
    variableName = name[ COMPILER.VARIABLE_VALUE ];
    

     return new PHP.VM.Variable( this.$Constants[ COMPILER.CONSTANT_DEFINED ]( variableName ) );
  
};

