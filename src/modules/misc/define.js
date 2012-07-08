/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 7.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.define = function( name, value, case_insensitive ) {
    
    var COMPILER = PHP.Compiler.prototype,
    
    variableValue = value[ COMPILER.VARIABLE_VALUE ];
    
    this[ COMPILER.CONSTANTS ][ COMPILER.CONSTANT_SET ]( name[ COMPILER.VARIABLE_VALUE ], variableValue );
    
    
  
};