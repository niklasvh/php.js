/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 5.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.ini_set = PHP.Modules.prototype.ini_alter = function( varname, newvalue ) {
      var COMPILER = PHP.Compiler.prototype;
    var old = this.$ini[ varname[ COMPILER.VARIABLE_VALUE ] ];
    
    this.$ini[ varname[ COMPILER.VARIABLE_VALUE ] ] = newvalue[ COMPILER.VARIABLE_VALUE ];
    
    
    return new PHP.VM.Variable( old );
};

