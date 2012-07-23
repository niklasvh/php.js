/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.ini_restore = function( varname ) {
  var COMPILER = PHP.Compiler.prototype;
    this.$ini[ varname[ COMPILER.VARIABLE_VALUE ] ] = Object.getPrototypeOf(this.$ini)[ varname[ COMPILER.VARIABLE_VALUE ] ];
    

    return new PHP.VM.Variable();
    
    
    
  
};
